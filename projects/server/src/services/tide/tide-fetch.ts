import { DateTime } from 'luxon';
import * as iso from '@wbtdevlocal/iso';
import { ServerPromise } from '../../api/error';
import { BaseConfig } from '../config';
import { LogContext } from '../logging/pino';
import { makeRequest } from '../network/request';
import { FetchedTide, getStartOfDayBefore } from './tide-shared';

/*
	From https://tidesandcurrents.noaa.gov/api/

	Sample URLs:
	https://tidesandcurrents.noaa.gov/api/datagetter?application=wells_beach_time&station=8419317&format=json&time_zone=lst_ldt&units=english&product=predictions&datum=mllw&interval=hilo&begin_date=20200425%2000%3A00&range=240
	https://tidesandcurrents.noaa.gov/api/datagetter?application=wells_beach_time&station=8419317&format=json&time_zone=lst_ldt&units=english&product=water_level&datum=mllw&date=latest
*/

export async function readTides(ctx: LogContext, config: BaseConfig): ServerPromise<FetchedTide> {
	return await fetchTides(ctx, config);
}

async function fetchTides(ctx: LogContext, config: BaseConfig): ServerPromise<FetchedTide> {

	const { referenceTime, futureCutoff } = config;
	const { tideStation } = iso.constant;

	const pastCutoff = getStartOfDayBefore(referenceTime);

	const startDateAsString = formatDateForRequest(pastCutoff);
	const hoursBetween = Math.ceil(futureCutoff.diff(pastCutoff, 'hours').hours);

	const predictionInput: NOAAPredictionInput = Object.assign({}, defaultNOAAInput, ({
		station: tideStation,
		product: 'predictions',
		datum: 'mllw', // From https://tidesandcurrents.noaa.gov/datum_options.html
		interval: 'hilo', // hi/lo, not just 6 minute intervals
		begin_date: startDateAsString,
		range: hoursBetween
	} as NOAAPredictionInput));

	const predictionResponse = await makeRequest<NOAAPredictionOutput>(ctx, 'Tides - prediction', createRequestUrl(predictionInput));
	if (iso.isServerError(predictionResponse)) {
		return predictionResponse;
	}

	const currentLevelInput: NOAACurrentLevelInput = Object.assign({}, defaultNOAAInput, ({
		station: tideStation,
		product: "water_level",
		datum: "mllw",
		date: "latest"
	} as NOAACurrentLevelInput));

	const currentLevelResponse = await makeRequest<NOAACurrentLevelOutput>(ctx, 'Tides - level', createRequestUrl(currentLevelInput));
	if (iso.isServerError(currentLevelResponse)) {
		return currentLevelResponse;
	}

	const currentLevelData = currentLevelResponse.data[0];

	// The current time can be 0-15 minutes behind our reference time.
	// Just use the reference time.
	//const currentTime = toDateTimeFromNOAAString(currentLevelData.t);
	const currentTime = config.referenceTime;

	const currentHeight = parseHeight(currentLevelData.v);

	const extrema: iso.Tide.ExtremeStamp[] = [];
	predictionResponse.predictions.forEach((p) => {
		const time = toDateTimeFromNOAAString(p.t);
		if (time < futureCutoff) {
			extrema.push({
				time: toDateTimeFromNOAAString(p.t),
				height: parseHeight(p.v),
				isLow: p.type.toUpperCase() !== "H"
			});
		}
	});

	return {
		currentTime,
		currentHeight,
		extrema
	};
}

function toDateTimeFromNOAAString(time: string): DateTime {
	// 2013-08-08 15:00
	return DateTime.fromFormat(time, 'yyyy-MM-dd HH:mm', { zone: iso.constant.timeZoneLabel });
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


interface NOAAPredictionOutput extends NOAARawErrorResponse {
	predictions: NOAAPredictionEntry[];
}

interface NOAAPredictionEntry {
	t: string,
	v: string,
	type: 'H' | 'L';
}

interface NOAACurrentLevelOutput extends NOAARawErrorResponse {
	data: NOAACurrentLevelEntry[];
}

interface NOAACurrentLevelEntry {
	t: string,
	v: string;
}

interface NOAARawErrorResponse {
	error: {
		message: string;
	};
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
