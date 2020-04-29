import { APIConfigurationContext } from "../all/context";
import { TideStatus, TideEvent, errorIssue } from "tidy-shared";
import { getJSON, FetchResponse } from "../util/fetch";
import { IntermediateTideValues } from "./tide-intermediate";
import { mergeIssues } from "../all/all-merge";
import { DateTime } from "luxon";

/*
	From https://tidesandcurrents.noaa.gov/api/

	Sample URLs:
	https://tidesandcurrents.noaa.gov/api/datagetter?application=messman_tidy&station=8419317&format=json&time_zone=lst_ldt&units=english&product=predictions&datum=mllw&interval=hilo&begin_date=20200425%2000%3A00&range=240
	https://tidesandcurrents.noaa.gov/api/datagetter?application=messman_tidy&station=8419317&format=json&time_zone=lst_ldt&units=english&product=water_level&datum=mllw&date=latest
*/

export async function fetchTides(configContext: APIConfigurationContext): Promise<IntermediateTideValues> {

	const station = configContext.configuration.tides.station;
	//const referenceTime = configContext.context.referenceTimeInZone;
	// Add one day to our max time because we need tides for the day after in order to construct graph UI.
	const maxTime = configContext.context.maxLongTermDataFetch.plus({ days: 1 });
	const pastTime = configContext.context.tides.minimumTidesDataFetch;

	const startDateAsString = formatDateForRequest(pastTime.toJSDate());
	const hoursBetween = Math.ceil(maxTime.diff(pastTime, 'hours').hours);

	const predictionInput: NOAAPredictionInput = Object.assign({}, defaultNOAAInput, ({
		station: station,
		product: 'predictions',
		datum: 'mllw', // From https://tidesandcurrents.noaa.gov/datum_options.html
		interval: 'hilo', // hi/lo, not just 6 minute intervals
		begin_date: startDateAsString,
		range: hoursBetween
	} as NOAAPredictionInput));

	const currentLevelInput: NOAACurrentLevelInput = Object.assign({}, defaultNOAAInput, ({
		station: station,
		product: "water_level",
		datum: "mllw",
		date: "latest"
	} as NOAACurrentLevelInput));

	const requests: [Promise<FetchResponse<NOAAPredictionOutput>>, Promise<FetchResponse<NOAACurrentLevelOutput>>] = [
		makeJSONRequest(predictionInput, 'tide prediction'),
		makeJSONRequest(currentLevelInput, 'tide level')
	];

	const [predictionResponse, currentLevelResponse] = await Promise.all(requests);

	const combinedIssues = mergeIssues([predictionResponse.issues, currentLevelResponse.issues]);
	if (combinedIssues) {
		return {
			errors: {
				errors: combinedIssues
			},
			warnings: null,
			pastEvents: null!,
			current: null!,
			futureEvents: null!
		}
	}

	const currentLevelData = currentLevelResponse.result!.data[0];
	const current: TideStatus = {
		time: DateTimeFromNOAAString(currentLevelData.t, configContext.configuration.location.timeZoneLabel).toJSDate(),
		height: parseFloat(parseFloat(currentLevelData.v).toFixed(configContext.configuration.tides.tideHeightPrecision))
	}

	const pastEvents: TideEvent[] = [];
	const futureEvents: TideEvent[] = [];
	const referenceTime = configContext.context.referenceTimeInZone;

	predictionResponse.result!.predictions.forEach((p) => {

		const eventTime = DateTimeFromNOAAString(p.t, configContext.configuration.location.timeZoneLabel);
		const event: TideEvent = {
			time: eventTime.toJSDate(),
			height: parseFloat(parseFloat(p.v).toFixed(configContext.configuration.tides.tideHeightPrecision)),
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
		errors: null,
		warnings: null,
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
	product: string
}

const defaultNOAAInput: BaseNOAAInput = {
	application: 'messman_tidy',
	station: null!,
	format: 'json',
	time_zone: 'lst_ldt', // Local Time with DST offset
	units: 'english',
	product: null!
}

interface NOAAPredictionInput extends BaseNOAAInput {
	datum: string,
	interval: string,
	begin_date: string,
	range: number
}

interface NOAACurrentLevelInput extends BaseNOAAInput {
	datum: string,
	date: string
}


interface NOAAPredictionOutput extends NOAARawErrorResponse {
	predictions: NOAAPredictionEntry[]
}

interface NOAAPredictionEntry {
	t: string,
	v: string,
	type: 'H' | 'L'
}

interface NOAACurrentLevelOutput extends NOAARawErrorResponse {
	data: NOAACurrentLevelEntry[]
}

interface NOAACurrentLevelEntry {
	t: string,
	v: string
}

interface NOAARawErrorResponse {
	error: {
		message: string
	}
}

async function makeJSONRequest<T extends NOAARawErrorResponse>(options: any, name: string): Promise<FetchResponse<T>> {
	const url = createRequestUrl(options);

	const fetched = await getJSON<T>(url, name, null);
	const { issues, result } = fetched;
	if (issues) {
		// Short-circuit, because it doesn't matter.
		return fetched as unknown as FetchResponse<T>;
	}

	const errorMessage = result?.error?.message;
	if (errorMessage) {
		return {
			issues: [errorIssue('Error retrieving tide information', errorMessage)],
			result: null
		};
	}
	return {
		issues: null,
		result: result!
	}
}

const api_noaa = "https://tidesandcurrents.noaa.gov/api/datagetter";
// Takes key-val options, returns a query string
function createRequestUrl(params: { [key: string]: any }): string {
	const paramsAsString = Object.keys(params).map(key => `${key}=${encodeURIComponent(params[key])}`).join("&");
	return `${api_noaa}?${paramsAsString}`;
}

// Return a formatted date minus X hours
function formatDateForRequest(d: Date): string {
	//yyyyMMdd HH:mm
	let twosNum = [d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes()];
	const twos = twosNum.map(function (num) {
		return num.toString().padStart(2, "0");
	});
	return `${d.getFullYear()}${twos[0]}${twos[1]} ${twos[2]}:${twos[3]}`;
}
