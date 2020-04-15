// API documentation: https://tidesandcurrents.noaa.gov/api/
const api_noaa = "https://tidesandcurrents.noaa.gov/api/datagetter";

import * as Raw from "./requestModels";
import * as Clean from "./models";
import fetch from "node-fetch";

const predictionHoursBefore = Math.round(24 * 1.5); // 1.5 days before
const predictionHoursAfter = Math.round(24 * 5.5); // 5.5 days after

export async function getNoaaData(): Promise<Clean.Response> {
	const rawResponse = await getRawNoaaData();
	const cleanResponse = processRawNoaaData(rawResponse);
	return cleanResponse;
}

async function getRawNoaaData(): Promise<Raw.Response> {

	const response: Raw.Response = {
		tzo: Infinity,
		errors: null,
		data: {
			waterLevelPrediction: {} as any,
			currentWaterLevel: {} as any,
			airPressure: {} as any,
			airTemp: {} as any,
			waterTemp: {} as any,
			wind: {} as any
		}
	}

	const requests: Promise<any>[] = [];

	/*
		NOTE: Concerning times and timezones:

		The time zone of the target (Wells, Maine) may be different than that of
		the server running this service and the client requesting the data.
		To deal with this, requests ask for local, DST-adjusted times and are handled as
		strings all the way to the client (except for some math here on the server where timezone
		doesn't matter).

		Below we make requests for predictions and need to pass a date. We *should* really
		make an initial request to the api that returns the local time so we can get a time offset
		and apply it to this date. That will work for any time of the year (though may break down
		around the hour of DST changes).
		
		To get around this without needing non-simultaneous requests, we will just assume Wells, Maine
		is currently at either 4 or 5 hours of time offset (Use 4, since DST season is beach season).
		This will bring us either exactly correct (or just the difference in time between the DST customs of 
		the server location and Wells, Maine, which is probably an hour),
		which will affect at most 1 prediction.
	*/

	// Next line is where we should be using the current time from Wells, Maine, but instead we will use system time
	const wellsMaineOffsetMin = -4 * 60; // -4 hours
	const currentTime = new Date();
	// TimezoneOffset is positive when behind and negative when ahead, so flip it 
	const currentTimeOffsetMin = -currentTime.getTimezoneOffset();
	response.tzo = currentTimeOffsetMin; // For debug
	currentTime.setMinutes(currentTime.getMinutes() + (currentTimeOffsetMin - wellsMaineOffsetMin));

	// Update the predictions to include the hours before and after that we want
	const predictionsOpts = Object.assign({}, specificFetchOptions.waterLevelPrediction);
	const beginDate = newDatePlusHours(-predictionHoursBefore, currentTime);
	const beginDateAsString = formatDateForRequest(beginDate);
	predictionsOpts["begin_date"] = beginDateAsString;
	predictionsOpts["range"] = predictionHoursBefore + predictionHoursAfter;

	requests.push(makeJSONRequest(predictionsOpts, "Water Level Prediction", response.data.waterLevelPrediction));

	requests.push(makeJSONRequest(specificFetchOptions.currentWaterLevel, "Current Water Level", response.data.currentWaterLevel));
	requests.push(makeJSONRequest(specificFetchOptions.airPressure, "Air Pressure", response.data.airPressure));
	requests.push(makeJSONRequest(specificFetchOptions.airTemp, "Air Temp", response.data.airTemp));
	requests.push(makeJSONRequest(specificFetchOptions.waterTemp, "Water Temp", response.data.waterTemp));
	requests.push(makeJSONRequest(specificFetchOptions.wind, "Wind", response.data.wind));

	await Promise.all(requests);
	// response object should be ready
	return response;

}

function processRawNoaaData(rawResponse: Raw.Response): Clean.Response {

	const cleanResponse: Clean.Response = {
		tzo: rawResponse.tzo,
		errors: null, // Will fill in below
		data: {
			waterLevel: null, // Will fill in below
			current: null, // Will fill in below
		}
	}

	processRawNoaaWaterLevel(rawResponse, cleanResponse);
	processRawNoaaCurrent(rawResponse, cleanResponse);

	return cleanResponse;
}

function processRawNoaaWaterLevel(raw: Raw.Response, clean: Clean.Response): void {

	const errors: Raw.JSONError[] = [];

	const rawCurrentWaterLevel = raw.data.currentWaterLevel;
	const rawWaterLevelPrediction = raw.data.waterLevelPrediction;

	let current: Clean.CurrentData = null;
	if (isErrorResponse(rawCurrentWaterLevel)) {
		errors.push(rawCurrentWaterLevel.error);
	}
	else {
		const firstData = rawCurrentWaterLevel.data[0];
		current = {
			time: parseTimeFromResponse(firstData.t),
			val: parseFloat(firstData.v)
		};
	}

	let rawPredictions: Raw.WaterLevelPredictionData[] = null;
	if (isErrorResponse(rawWaterLevelPrediction)) {
		errors.push(rawWaterLevelPrediction.error);
	}
	else {
		rawPredictions = rawWaterLevelPrediction.predictions;
	}

	// Leave early if we have issues with the water level responses
	if (errors.length) {
		if (clean.errors && clean.errors.length)
			clean.errors = [...clean.errors, ...errors];
		else
			clean.errors = errors;
		return;
	}

	// So, our data must exist here for current and predictions

	// Get the predictions parsed
	const predictions = rawPredictions.map<Clean.WaterLevelPrediction>((rawPrediction) => {
		return {
			time: parseTimeFromResponse(rawPrediction.t),
			val: parseFloat(rawPrediction.v),
			isHigh: rawPrediction.type.toUpperCase() === "H"
		}
	});

	// Find where the current level is in the predictions
	let indexOfClosestBefore: number = 0;

	// Below we will parse times just for the sake of math. 
	// They will all be parsed the same way so it won't affect anything.

	const currentTime = (new Date(current.time)).getTime();
	let minTimeDiff = Infinity;
	for (let i = 0; i < predictions.length; i++) {
		const prediction = predictions[i];
		const diff = currentTime - (new Date(prediction.time)).getTime();
		if (diff < 0)
			break;
		if (diff < minTimeDiff) {
			indexOfClosestBefore = i;
			minTimeDiff = diff;
		}
	}

	const predictionsBeforeCurrent = predictions.slice(0, indexOfClosestBefore + 1);
	const previous = predictions[indexOfClosestBefore];
	const currentIsRising = !previous.isHigh;
	const next = predictions[indexOfClosestBefore + 1];
	const predictionsAfterCurrent = predictions.slice(indexOfClosestBefore + 1);

	const high = currentIsRising ? next : previous;
	const low = currentIsRising ? previous : next;

	// Make sure the current is between the high and low for the purpose of this calculation
	// So we dont get negative percents or percents over 1
	const currentValClamped = Math.min(Math.max(current.val, low.val), high.val);
	const currentPercentFallen = 1 - ((currentValClamped - low.val) / (high.val - low.val));

	clean.data.waterLevel = {
		predictionsBeforeCurrent,
		previous,
		current,
		currentIsRising,
		currentPercentFallen,
		next,
		high,
		low,
		predictionsAfterCurrent,
	}
}

function processRawNoaaCurrent(raw: Raw.Response, clean: Clean.Response): void {

	const errors: Raw.JSONError[] = [];

	clean.data.current = {
		airPressure: null,
		airTemp: null,
		waterTemp: null,
		wind: null
	}

	//
	// Air Pressure
	const rawAirPressure = raw.data.airPressure;
	if (isErrorResponse(rawAirPressure)) {
		errors.push(rawAirPressure.error);
	}
	else {
		const firstData = rawAirPressure.data[0];
		clean.data.current.airPressure = {
			time: parseTimeFromResponse(firstData.t),
			val: parseFloat(firstData.v)
		};
	}

	//
	// Air Temp
	const rawAirTemp = raw.data.airTemp;
	if (isErrorResponse(rawAirTemp)) {
		errors.push(rawAirTemp.error);
	}
	else {
		const firstData = rawAirTemp.data[0];
		clean.data.current.airTemp = {
			time: parseTimeFromResponse(firstData.t),
			val: parseFloat(firstData.v)
		};
	}

	//
	// Water Temp
	const rawWaterTemp = raw.data.waterTemp;
	if (isErrorResponse(rawWaterTemp)) {
		errors.push(rawWaterTemp.error);
	}
	else {
		const firstData = rawWaterTemp.data[0];
		clean.data.current.waterTemp = {
			time: parseTimeFromResponse(firstData.t),
			val: parseFloat(firstData.v)
		};
	}

	//
	// Wind
	const rawWind = raw.data.wind;
	if (isErrorResponse(rawWind)) {
		errors.push(rawWind.error);
	}
	else {
		const firstData = rawWind.data[0];
		clean.data.current.wind = {
			time: parseTimeFromResponse(firstData.t),
			direction: parseFloat(firstData.d),
			directionCardinal: firstData.dr,
			gust: parseFloat(firstData.g),
			speed: parseFloat(firstData.s),
		};
	}

	if (errors.length) {
		if (clean.errors && clean.errors.length)
			clean.errors = [...clean.errors, ...errors];
		else
			clean.errors = errors;
	}
}

//
// Request Info
//

// Required for every request
const defaultFetchOptions = {
	station: 8419317, // Default: Wells, ME https://tidesandcurrents.noaa.gov/stationhome.html?id=8419317
	application: "messman_tidy",
	format: "json",
	time_zone: "lst_ldt", // Local Time with DST offset
	units: "english", // english | metric
}

// Additional parameters required for certain requests
const specificFetchOptions = {
	// Gets the water level **predictions** (may be higher/lower than current! meaning, not always accurate)
	waterLevelPrediction: { product: "predictions", datum: "mtl", interval: "hilo" /* hi/lo, not just 6 minute intervals */ },

	// Current...
	currentWaterLevel: { product: "water_level", datum: "mtl", date: "latest" },
	airTemp: { product: "air_temperature", date: "latest" },
	waterTemp: { product: "water_temperature", date: "latest" },
	wind: { product: "wind", date: "latest" },
	airPressure: { product: "air_pressure", date: "latest" },
};

//
// Tools
//

async function makeJSONRequest<T>(options, errContext: string, responseObject: any): Promise<any> {
	const url = createRequestUrl(options);

	console.log(`Requesting ${url}`);

	function handleErr(e: Error) {
		const err = responseObject as Raw.ErrorResponse;
		err.error = {
			errText: e.message,
			errContext
		};
	}

	try {
		const res = await fetch(url);
		if (res.ok) {
			const json = await res.json();
			if (json["error"]) {
				// Returned 200, but had an internal error
				throw new Error(json["error"]["message"]);
			}
			const complete = responseObject as Raw.RawResponse<T>;
			Object.keys(json).forEach((key) => {
				complete[key] = json[key];
			});
		}
		else {
			handleErr(new Error(`${res.status}: ${res.statusText}`));
		}
	} catch (e) {
		handleErr(e);
	}
}

// Takes key-val options, returns a query string
function createRequestUrl(opts: {}): string {
	// Add default options plus additional options
	opts = Object.assign({}, defaultFetchOptions, opts);
	// Encode to string
	const optsString = Object.keys(opts).map(key => `${key}=${encodeURIComponent(opts[key])}`).join("&");
	return api_noaa + "?" + optsString;
}

// Return a new date with modified hours
function newDatePlusHours(addHours: number, date: Date): Date {
	const newDate = new Date(date.getTime());
	newDate.setHours(newDate.getHours() + addHours);
	return newDate;
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

function isErrorResponse(raw: any): raw is Raw.ErrorResponse {
	return !!raw["error"] && !!raw["error"]["errText"];
}

function parseTimeFromResponse(timeString: string): string {
	// Do nothing. See notes elsewhere in this file.
	return timeString;
}

//
// Fake Data
//

const fakeResponse1: Raw.Response = {
	"tzo": 0,
	"errors": null,
	"data": {
		"waterLevelPrediction": {
			"predictions": [
				{
					"t": "2018-08-17 23:12",
					"v": "-4.523",
					"type": "L"
				},
				{
					"t": "2018-08-18 05:29",
					"v": "4.080",
					"type": "H"
				},
				{
					"t": "2018-08-18 11:31",
					"v": "-4.123",
					"type": "L"
				},
				{
					"t": "2018-08-18 17:54",
					"v": "4.647",
					"type": "H"
				},
				{
					"t": "2018-08-19 00:14",
					"v": "-4.186",
					"type": "L"
				},
				{
					"t": "2018-08-19 06:30",
					"v": "3.593",
					"type": "H"
				},
				{
					"t": "2018-08-19 12:29",
					"v": "-3.681",
					"type": "L"
				},
				{
					"t": "2018-08-19 18:52",
					"v": "4.363",
					"type": "H"
				},
				{
					"t": "2018-08-20 01:15",
					"v": "-3.972",
					"type": "L"
				},
				{
					"t": "2018-08-20 07:32",
					"v": "3.289",
					"type": "H"
				},
				{
					"t": "2018-08-20 13:27",
					"v": "-3.391",
					"type": "L"
				},
				{
					"t": "2018-08-20 19:50",
					"v": "4.196",
					"type": "H"
				},
				{
					"t": "2018-08-21 02:15",
					"v": "-3.907",
					"type": "L"
				},
				{
					"t": "2018-08-21 08:32",
					"v": "3.188",
					"type": "H"
				},
				{
					"t": "2018-08-21 14:24",
					"v": "-3.278",
					"type": "L"
				},
				{
					"t": "2018-08-21 20:45",
					"v": "4.170",
					"type": "H"
				},
				{
					"t": "2018-08-22 03:09",
					"v": "-3.972",
					"type": "L"
				},
				{
					"t": "2018-08-22 09:26",
					"v": "3.247",
					"type": "H"
				},
				{
					"t": "2018-08-22 15:17",
					"v": "-3.321",
					"type": "L"
				},
				{
					"t": "2018-08-22 21:35",
					"v": "4.261",
					"type": "H"
				}
			]
		},
		"currentWaterLevel": {
			"metadata": {
				"id": "8419317",
				"name": "Wells",
				"lat": "43.3200",
				"lon": "-70.5633"
			},
			"data": [
				{
					"t": "2018-08-18 21:48",
					"v": "-1.024",
					"s": "0.033",
					"f": "0,0,0,0",
					"q": "p"
				}
			]
		},
		"airPressure": {
			"metadata": {
				"id": "8419317",
				"name": "Wells",
				"lat": "43.3200",
				"lon": "-70.5633"
			},
			"data": [
				{
					"t": "2018-08-18 21:48",
					"v": "1012.9",
					"f": "0,0,0"
				}
			]
		},
		"airTemp": {
			"metadata": {
				"id": "8419317",
				"name": "Wells",
				"lat": "43.3200",
				"lon": "-70.5633"
			},
			"data": [
				{
					"t": "2018-08-18 21:48",
					"v": "67.6",
					"f": "0,0,0"
				}
			]
		},
		"waterTemp": {
			"metadata": {
				"id": "8419317",
				"name": "Wells",
				"lat": "43.3200",
				"lon": "-70.5633"
			},
			"data": [
				{
					"t": "2018-08-18 21:48",
					"v": "67.3",
					"f": "0,0,0"
				}
			]
		},
		"wind": {
			"metadata": {
				"id": "8419317",
				"name": "Wells",
				"lat": "43.3200",
				"lon": "-70.5633"
			},
			"data": [
				{
					"t": "2018-08-18 21:48",
					"s": "5.64",
					"d": "14.00",
					"dr": "NNE",
					"g": "7.97",
					"f": "0,0"
				}
			]
		}
	}
}
