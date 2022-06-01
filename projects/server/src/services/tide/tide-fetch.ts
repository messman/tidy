import { DateTime } from 'luxon';
import * as iso from '@wbtdevlocal/iso';
import { ServerPromise } from '../../api/error';
import { LogContext } from '../logging/pino';
import { makeRequest } from '../network/request';
import { TideConfig } from './tide-config';

export interface FetchedTide {
	pastEvents: iso.Tide.TideEvent[],
	current: iso.Tide.TideStatus,
	futureEvents: iso.Tide.TideEvent[];
}

/*
	From https://tidesandcurrents.noaa.gov/api/

	Sample URLs:
	https://tidesandcurrents.noaa.gov/api/datagetter?application=messman_tidy&station=8419317&format=json&time_zone=lst_ldt&units=english&product=predictions&datum=mllw&interval=hilo&begin_date=20200425%2000%3A00&range=240
	https://tidesandcurrents.noaa.gov/api/datagetter?application=messman_tidy&station=8419317&format=json&time_zone=lst_ldt&units=english&product=water_level&datum=mllw&date=latest
*/

export async function fetchTides(ctx: LogContext, config: TideConfig): ServerPromise<FetchedTide> {

	const station = config.tide.input.station;
	// Add one day to our max time because we need tides for the day after in order to construct graph UI.
	const maxTime = config.base.live.maxLongTermDataFetch.plus({ days: 1 });
	const pastTime = config.tide.live.minimumTidesDataFetch;

	const startDateAsString = formatDateForRequest(pastTime);
	const hoursBetween = Math.ceil(maxTime.diff(pastTime, 'hours').hours);

	const predictionInput: NOAAPredictionInput = Object.assign({}, defaultNOAAInput, ({
		station: station,
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
		station: station,
		product: "water_level",
		datum: "mllw",
		date: "latest"
	} as NOAACurrentLevelInput));

	const currentLevelResponse = await makeRequest<NOAACurrentLevelOutput>(ctx, 'Tides - level', createRequestUrl(currentLevelInput));
	if (iso.isServerError(currentLevelResponse)) {
		return currentLevelResponse;
	}

	const { tideHeightPrecision } = config.tide.input;

	const currentLevelData = currentLevelResponse.data[0];
	const current: iso.Tide.TideStatus = {
		time: DateTimeFromNOAAString(currentLevelData.t, config.base.input.timeZoneLabel),
		height: parseFloat(parseFloat(currentLevelData.v).toFixed(tideHeightPrecision))
	};

	const pastEvents: iso.Tide.TideEvent[] = [];
	const futureEvents: iso.Tide.TideEvent[] = [];
	const referenceTime = config.base.live.referenceTimeInZone;

	predictionResponse.predictions.forEach((p) => {

		const eventTime = DateTimeFromNOAAString(p.t, config.base.input.timeZoneLabel);
		const event: iso.Tide.TideEvent = {
			time: eventTime,
			height: parseFloat(parseFloat(p.v).toFixed(tideHeightPrecision)),
			isLow: p.type.toUpperCase() !== "H"
		};

		if (eventTime > referenceTime) {
			futureEvents.push(event);
		}
		else {
			pastEvents.push(event);
		}
	});

	return {
		pastEvents: pastEvents,
		current: current,
		futureEvents: futureEvents
	};
}

function DateTimeFromNOAAString(time: string, zone: string): DateTime {
	// 2013-08-08 15:00
	return DateTime.fromFormat(time, 'yyyy-MM-dd HH:mm', { zone: zone });
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
	application: 'messman_tidy',
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
