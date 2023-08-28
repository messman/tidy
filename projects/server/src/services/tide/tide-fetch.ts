import { DateTime } from 'luxon';
import { constant, isServerError, TidePointCurrent, TidePointExtreme } from '@wbtdevlocal/iso';
import { serverErrors, ServerPromise } from '../../api/error';
import { BaseConfig } from '../config';
import { LogContext } from '../logging/pino';
import { makeRequest } from '../network/request';
import { getStartOfDayBefore } from '../time';
import { computeHeightAtTimeBetweenPredictions, createTidePointExtremeId, TideFetched } from './tide-shared';

/*
	From https://tidesandcurrents.noaa.gov/api/

	Sample URLs:
	https://tidesandcurrents.noaa.gov/api/datagetter?application=wells_beach_time&station=8419317&format=json&time_zone=lst_ldt&units=english&product=predictions&datum=mllw&interval=hilo&begin_date=20200425%2000%3A00&range=240
	https://tidesandcurrents.noaa.gov/api/datagetter?application=wells_beach_time&station=8419317&format=json&time_zone=lst_ldt&units=english&product=water_level&datum=mllw&date=latest
*/

export async function fetchTides(ctx: LogContext, config: BaseConfig): ServerPromise<TideFetched> {
	const extrema = await getPredictions(ctx, config);
	if (isServerError(extrema)) {
		return extrema;
	}
	let current = await getMeasured(ctx);
	if (isServerError(current)) {
		return current;
	}

	// Now also compute, and always return it.
	const computed = getComputed(config, extrema);
	if (current) {
		current.computed = computed;
	}
	else {
		current = {
			computed,
			height: computed,
			isAlternate: false,
			isComputed: true,
			time: config.referenceTime
		} satisfies TidePointCurrent;
	}

	return {
		current,
		extrema
	};
}

/**
 * Based on the reference time, get what we think the height is.
 * This logic is based off the same logic used for beach access height time.
 */
function getComputed(config: BaseConfig, extrema: TidePointExtreme[]): number {
	const { referenceTime } = config;

	// get previous and next
	let previous: TidePointExtreme = null!;
	let next: TidePointExtreme = null!;

	for (let i = 0; i < extrema.length; i++) {
		if (extrema[i].time >= referenceTime) {
			previous = extrema[i - 1];
			next = extrema[i];
			break;
		}
	}

	return computeHeightAtTimeBetweenPredictions(previous, next, referenceTime);
}

async function getPredictions(ctx: LogContext, config: BaseConfig): ServerPromise<TidePointExtreme[]> {
	const { referenceTime, futureCutoff } = config;
	const { wells } = constant.tideStations;

	const pastCutoff = getStartOfDayBefore(referenceTime);

	const startDateAsString = formatDateForRequest(pastCutoff);
	const hoursBetween = Math.ceil(futureCutoff.diff(pastCutoff, 'hours').hours);

	const predictionInput: NOAAPredictionInput = Object.assign({}, defaultNOAAInput, ({
		station: wells,
		product: 'predictions',
		datum: 'mllw', // From https://tidesandcurrents.noaa.gov/datum_options.html
		interval: 'hilo', // hi/lo, not just 6 minute intervals
		begin_date: startDateAsString,
		range: hoursBetween
	} as NOAAPredictionInput));

	const predictionResponse = await makeRequest<NOAAPredictionOutput>(ctx, 'Tides - prediction', createRequestUrl(predictionInput));
	if (isServerError(predictionResponse)) {
		return predictionResponse;
	}
	if (isNOAARawErrorResponse(predictionResponse)) {
		// If we can't have predictions, we have nothing. Get out.
		return serverErrors.internal.service(ctx, 'Tides - prediction', {
			hiddenArea: 'Service returned an error object',
			hiddenLog: { message: predictionResponse.error?.message || 'No message' }
		});
	}

	const extrema: TidePointExtreme[] = [];
	predictionResponse.predictions.forEach((p) => {
		const time = toDateTimeFromNOAAString(p.t);
		if (time < futureCutoff) {
			extrema.push({
				id: createTidePointExtremeId(time),
				time,
				height: parseHeight(p.v),
				isLow: p.type.toUpperCase() !== "H"
			});
		}
	});
	return extrema;
}


async function getMeasured(ctx: LogContext): ServerPromise<TidePointCurrent | null> {
	const { wells, portland } = constant.tideStations;

	/*
		The reason for this complexity:
		The measurements of water levels from the NOAA station in Wells is finicky.
		In 2019 and 2022, the measurements went offline for some time. But we can't just throw the whole app
		away when that happens. So we have two backups:
		- Using Portland
		- Computing the water level from predictions like we do for beach time access height
	*/

	let isHeightAlternate = false;
	let heightTime: DateTime = null!;
	let height: number = null!;

	// Try to get the measurements from Wells.
	const wellsLevelInput: NOAACurrentLevelInput = Object.assign({}, defaultNOAAInput, ({
		station: wells,
		product: "water_level",
		datum: "mllw",
		date: "latest"
	} as NOAACurrentLevelInput));

	const wellsLevelResponse = await makeRequest<NOAACurrentLevelOutput>(ctx, 'Tides - level', createRequestUrl(wellsLevelInput));
	if (isServerError(wellsLevelResponse)) {
		return wellsLevelResponse;
	}
	else if (isNOAARawErrorResponse(wellsLevelResponse)) {
		// Could not get the water level from Wells.
		ctx.logger.warn('Tide level response from Wells is an error - no water level available', {
			message: wellsLevelResponse.error?.message || 'No message'
		});

		// Try Portland
		const portlandLevelInput: NOAACurrentLevelInput = Object.assign({}, defaultNOAAInput, ({
			station: portland,
			product: "water_level",
			datum: "mllw",
			date: "latest"
		} as NOAACurrentLevelInput));

		const portlandLevelResponse = await makeRequest<NOAACurrentLevelOutput>(ctx, 'Tides - level', createRequestUrl(portlandLevelInput));
		if (isServerError(portlandLevelResponse)) {
			return portlandLevelResponse;
		}
		else if (isNOAARawErrorResponse(portlandLevelResponse)) {
			// Could not get the water level from Portland.
			ctx.logger.warn('Tide level response from Portland is an error - no water level available', {
				message: wellsLevelResponse.error?.message || 'No message'
			});

			// Portland failed too? Aw man.
			return null;

		}
		else {
			isHeightAlternate = true;
			const data = portlandLevelResponse.data[0];
			height = parseHeight(data.v);
			heightTime = toDateTimeFromNOAAString(data.t); // May be significantly in the past
		}
	}
	else {
		const data = wellsLevelResponse.data[0];
		height = parseHeight(data.v);
		heightTime = toDateTimeFromNOAAString(data.t); // May be significantly in the past
	}

	const current: TidePointCurrent = {
		computed: null!, // Will handle in a moment
		isAlternate: isHeightAlternate,
		isComputed: false,
		height,
		time: heightTime
	};
	return current;
}

function toDateTimeFromNOAAString(time: string): DateTime {
	// 2013-08-08 15:00
	return DateTime.fromFormat(time, 'yyyy-MM-dd HH:mm', { zone: constant.timeZoneLabel });
}

function parseHeight(value: any): number {
	return parseFloat(parseFloat(value).toFixed(1));
}

// From https://tidesandcurrents.noaa.gov/api/
interface BaseNOAAInput {
	application: string,
	station: number,
	format: string,
	time_zone: string,
	units: 'english' | 'metric',
	product: string;
}

const defaultNOAAInput: BaseNOAAInput = {
	application: 'wells_beach_time',
	station: null!,
	format: 'json',
	time_zone: 'lst_ldt', // Local Time with DST offset
	units: 'english',
	product: null!
};

interface NOAAPredictionInput extends BaseNOAAInput {
	datum: string,
	interval: string,
	begin_date: string,
	range: number;
}

interface NOAACurrentLevelInput extends BaseNOAAInput {
	datum: string,
	date: string;
}


type NOAAPredictionOutput = NOAARawErrorResponse | {
	predictions: NOAAPredictionEntry[];
};

interface NOAAPredictionEntry {
	t: string,
	v: string,
	type: 'H' | 'L';
}

type NOAACurrentLevelOutput = NOAARawErrorResponse | {
	data: NOAACurrentLevelEntry[];
};

interface NOAACurrentLevelEntry {
	t: string,
	v: string;
}

interface NOAARawErrorResponse {
	error: {
		message: string;
	};
}
function isNOAARawErrorResponse(response: any): response is NOAARawErrorResponse {
	return !!response && !!(response as NOAARawErrorResponse).error;
}

const api_noaa = "https://tidesandcurrents.noaa.gov/api/datagetter";
// Takes key-val options, returns a query string
function createRequestUrl(params: { [key: string]: any; }): string {
	const paramsAsString = Object.keys(params).map(key => `${key}=${encodeURIComponent(params[key])}`).join("&");
	return `${api_noaa}?${paramsAsString}`;
}

// Return a formatted date minus X hours
function formatDateForRequest(d: DateTime): string {
	//yyyyMMdd HH:mm
	let twosNum = [d.month, d.day, d.hour, d.minute];
	const twos = twosNum.map(function (num) {
		return num.toString().padStart(2, "0");
	});
	return `${d.year}${twos[0]}${twos[1]} ${twos[2]}:${twos[3]}`;
}
