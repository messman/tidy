import { DateTime } from 'luxon';
import { constant, isServerError, TidePointExtreme } from '@wbtdevlocal/iso';
import { serverErrors, ServerPromise } from '../../api/error';
import { BaseConfig } from '../config';
import { LogContext } from '../logging/pino';
import { makeRequestJson } from '../network/request';
import { getStartOfDayBefore } from '../time';
import { createTidePointExtremeId } from './tide-shared';

/*
	From https://tidesandcurrents.noaa.gov/api/

	Sample URLs:
	https://tidesandcurrents.noaa.gov/api/datagetter?application=wells_beach_time&station=8419317&format=json&time_zone=lst_ldt&units=english&product=predictions&datum=mllw&interval=hilo&begin_date=20200425%2000%3A00&range=240
	https://tidesandcurrents.noaa.gov/api/datagetter?application=wells_beach_time&station=8419317&format=json&time_zone=lst_ldt&units=english&product=water_level&datum=mllw&date=latest
*/

export interface TideFetchedNOAA {
	/** Astronomical predictions for Wells. */
	wellsExtrema: TidePointExtreme[];
	/** Astronomical predictions for Portland. */
	portlandExtrema: TidePointExtreme[];
	/** Current observed water level data from Portland. */
	portlandCurrent: TideFetchedNOAACurrent | null;
}

export interface TideFetchedNOAACurrent {
	value: number;
	time: DateTime;
}

export async function fetchTidesNOAA(ctx: LogContext, config: BaseConfig): ServerPromise<TideFetchedNOAA> {
	const wellsExtrema = await getPredictionsForStation(ctx, config, constant.tideStations.wells);
	if (isServerError(wellsExtrema)) {
		return wellsExtrema;
	}
	const portlandExtrema = await getPredictionsForStation(ctx, config, constant.tideStations.portland);
	if (isServerError(portlandExtrema)) {
		return portlandExtrema;
	}
	const portlandCurrent = await getCurrentFromPortland(ctx);
	if (isServerError(portlandCurrent)) {
		return portlandCurrent;
	}
	return {
		wellsExtrema,
		portlandExtrema,
		portlandCurrent
	};
}


async function getPredictionsForStation(ctx: LogContext, config: BaseConfig, station: number): ServerPromise<TidePointExtreme[]> {
	/*
		Note: these predictions are based on astronomical tide (gravitational effects of the moon and sun
		and the rotation of the Earth), but not based on wind, pressure, or river flow. That's what GoMOFS is for.
		However, this is what most websites use for their tide charts.
	*/

	const { referenceTime, futureCutoff } = config;

	const pastCutoff = getStartOfDayBefore(referenceTime);

	const startDateAsString = formatDateForRequest(pastCutoff);
	const hoursBetween = Math.ceil(futureCutoff.diff(pastCutoff, 'hours').hours);

	const predictionInput: NOAAPredictionInput = Object.assign({}, defaultNOAAInput, ({
		station,
		product: 'predictions',
		datum: 'mllw', // From https://tidesandcurrents.noaa.gov/datum_options.html
		interval: 'hilo', // hi/lo, not just 6 minute intervals
		begin_date: startDateAsString,
		range: hoursBetween
	} as NOAAPredictionInput));

	const predictionResponse = await makeRequestJson<NOAAPredictionOutput>(ctx, 'Tides - prediction', createRequestUrl(predictionInput));
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
				id: createTidePointExtremeId(time, 'noaa'),
				time,
				height: parseHeight(p.v),
				isLow: p.type.toUpperCase() !== "H"
			});
		}
	});
	return extrema;
}



async function getCurrentFromPortland(ctx: LogContext): ServerPromise<TideFetchedNOAACurrent | null> {
	const { portland } = constant.tideStations;

	/*
		Unfortunately, the Wells station is no longer operating. It had worked well since 2017-ish, but had a pause
		in 2019 and shut down in 2022.

		We use Portland instead, which is regularly about half a foot higher water level than Wells when compared through
		OFS (a different system):
		- Wells: https://tidesandcurrents.noaa.gov/ofs/ofs_station.html?stname=Wells&ofs=gom&stnid=8419317&subdomain=0
		- Portland: https://tidesandcurrents.noaa.gov/ofs/ofs_station.html?stname=Portland&ofs=gom&stnid=8418150&subdomain=0

		Also, note that because this is observational data, it can be a little on the later side.
	*/

	const portlandLevelInput: NOAACurrentLevelInput = Object.assign({}, defaultNOAAInput, ({
		station: portland,
		product: "water_level",
		datum: "mllw",
		date: "latest"
	} as NOAACurrentLevelInput));

	const portlandLevelResponse = await makeRequestJson<NOAACurrentLevelOutput>(ctx, 'Tides - level', createRequestUrl(portlandLevelInput));
	if (isServerError(portlandLevelResponse)) {
		return portlandLevelResponse;
	}
	else if (isNOAARawErrorResponse(portlandLevelResponse)) {
		// Could not get the water level from Portland.
		ctx.logger.warn('Tide level response from Portland is an error - no water level available', {
			message: portlandLevelResponse.error?.message || 'No message'
		});
		// Portland failed? Aw man.
		return null;
	}

	const data = portlandLevelResponse.data[0];
	return {
		value: parseHeight(data.v),
		time: toDateTimeFromNOAAString(data.t)
	};
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
