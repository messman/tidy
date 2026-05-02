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

	We fetch from three locations:
	- Wells, ME - for predictions. This station is no longer operating, but it had worked well since 2017-ish, and is what we have historical data for.
		- https://tidesandcurrents.noaa.gov/stationhome.html?id=8419317
	- Portland, ME - for predictions and current water level
		- https://tidesandcurrents.noaa.gov/stationhome.html?id=8418150
	- Seavey Island, NH (near Portsmouth NH) - for predictions and current water level	
		- https://tidesandcurrents.noaa.gov/stationhome.html?id=8419870

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
	portlandCurrent: TideFetchedNOAACurrent;
	/** Astronomical predictions for Seavey Island. */
	seaveyIslandExtrema: TidePointExtreme[];
	/** Current observed water level data from Seavey Island. */
	seaveyIslandCurrent: TideFetchedNOAACurrent;
}

export interface TideFetchedNOAACurrent {
	waterLevel: TideFetchedNOAACurrentDatum;
	waterTemp: TideFetchedNOAACurrentDatum;
}

export interface TideFetchedNOAACurrentDatum {
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
	const seaveyIslandExtrema = await getPredictionsForStation(ctx, config, constant.tideStations.seaveyIsland);
	if (isServerError(seaveyIslandExtrema)) {
		return seaveyIslandExtrema;
	}

	/*
		Unfortunately, the Wells station is no longer operating. It had worked well since 2017-ish, but had a pause
		in 2019 and shut down in 2022.

		To make up for the lack of current water level data in Wells, we used to use the Portland station + GoMOFS data.
		However, the GoMOFS data is often unavailable (server issues).

		So instead, we will use Portland + Seavey Island, the two closest stations.

		OFS pages for each, for comparison:
		- Wells: https://tidesandcurrents.noaa.gov/ofs/ofs_station.html?stname=Wells&ofs=gom&stnid=8419317&subdomain=0
		- Portland: https://tidesandcurrents.noaa.gov/ofs/ofs_station.html?stname=Portland&ofs=gom&stnid=8418150&subdomain=0
		- Seavey Island: https://tidesandcurrents.noaa.gov/ofs/ofs_station.html?stname=Seavey%20Island&ofs=gom&stnid=8419870&subdomain=0

		Also, note that because this is observational data, it can be a little on the later side.
	*/

	const portlandCurrent = await getCurrentForStation(ctx, constant.tideStations.portland);
	if (isServerError(portlandCurrent)) {
		return portlandCurrent;
	}

	const seaveyIslandCurrent = await getCurrentForStation(ctx, constant.tideStations.seaveyIsland);
	if (isServerError(seaveyIslandCurrent)) {
		return seaveyIslandCurrent;
	}

	return {
		wellsExtrema,
		portlandExtrema,
		portlandCurrent,
		seaveyIslandExtrema,
		seaveyIslandCurrent
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

async function getCurrentForStation(ctx: LogContext, station: number): ServerPromise<TideFetchedNOAACurrent> {

	// Water level
	const levelInput: NOAACurrentLevelInput = Object.assign({}, defaultNOAAInput, ({
		station,
		product: "water_level",
		datum: "mllw",
		date: "latest"
	} as NOAACurrentLevelInput));

	const levelResponse = await makeRequestJson<NOAACurrentLevelOutput>(ctx, 'Tides - level', createRequestUrl(levelInput));
	if (isServerError(levelResponse)) {
		return levelResponse;
	}
	else if (isNOAARawErrorResponse(levelResponse)) {
		// We need this information, so if it fails, let's get out.
		return serverErrors.internal.service(ctx, 'Tides - level', {
			hiddenArea: 'Service returned an error object',
			hiddenLog: { message: levelResponse.error?.message || 'No message' }
		});
	}
	const waterLevelData = levelResponse.data[0];

	// Water temperature
	const tempInput: NOAACurrentLevelInput = Object.assign({}, defaultNOAAInput, ({
		station,
		product: "water_temperature",
		datum: "mllw",
		date: "latest"
	} as NOAACurrentLevelInput));

	const tempResponse = await makeRequestJson<NOAACurrentLevelOutput>(ctx, 'Tides - temperature', createRequestUrl(tempInput));
	if (isServerError(tempResponse)) {
		return tempResponse;
	}
	else if (isNOAARawErrorResponse(tempResponse)) {
		// Could not get the water temperature from the station.
		ctx.logger.warn('Tide temperature response from station is an error - no water temperature available', {
			message: tempResponse.error?.message || 'No message'
		});
		// Station failed? Aw man.
		return serverErrors.internal.service(ctx, 'Tides - temperature', {
			hiddenArea: 'Service returned an error object',
			hiddenLog: { message: tempResponse.error?.message || 'No message' }
		});
	}
	const waterTempData = tempResponse.data[0];

	return {
		waterLevel: {
			value: parseHeight(waterLevelData.v),
			time: toDateTimeFromNOAAString(waterLevelData.t)
		},
		waterTemp: {
			value: parseHeight(waterTempData.v),
			time: toDateTimeFromNOAAString(waterTempData.t)
		}
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
