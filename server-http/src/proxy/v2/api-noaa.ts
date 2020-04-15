// import { SingleAPIResponse } from "./api";
// import fetch from "node-fetch";

// export interface NOAAResponse {
// 	predictions: TidePrediction[],
// 	waterLevel: TideLevel
// }

// export async function getNOAAData(): Promise<SingleAPIResponse<NOAAResponse>> {

// 	/*
// 		NOTE: Concerning times and timezones:

// 		The time zone of the target (Wells, Maine) may be different than that of
// 		the server running this service and the client requesting the data.
// 		To deal with this, requests ask for local, DST-adjusted times and are handled as
// 		strings all the way to the client (except for some math here on the server where timezone
// 		doesn't matter).

// 		Below we make requests for predictions and need to pass a date. We *should* really
// 		make an initial request to the api that returns the local time so we can get a time offset
// 		and apply it to this date. That will work for any time of the year (though may break down
// 		around the hour of DST changes).

// 		To get around this without needing non-simultaneous requests, we will just assume Wells, Maine
// 		is currently at either 4 or 5 hours of time offset (Use 4, since DST season is beach season).
// 		This will bring us either exactly correct (or just the difference in time between the DST customs of 
// 		the server location and Wells, Maine, which is probably an hour),
// 		which will affect at most 1 prediction.
// 		But that's okay, because the times are returned in Maine local DST time and we can sort through as needed. 
// 	*/

// 	// Next line is where we should be using the current time from Wells, Maine, but instead we will use system time
// 	const wellsMaineOffsetMin = -4 * 60; // -4 hours
// 	const currentTime = new Date();
// 	// TimezoneOffset is positive when behind and negative when ahead, so flip it 
// 	const currentTimeOffsetMin = -currentTime.getTimezoneOffset();
// 	//response.tzo = currentTimeOffsetMin; // For debug
// 	currentTime.setMinutes(currentTime.getMinutes() + (currentTimeOffsetMin - wellsMaineOffsetMin));

// 	// Update the predictions to include the hours before and after that we want
// 	const predictionsOpts = Object.assign({}, specificFetchOptions.waterLevelPrediction);
// 	const beginDate = newDatePlusHours(-predictionHoursBefore, currentTime);
// 	const beginDateAsString = formatDateForRequest(beginDate);
// 	predictionsOpts["begin_date"] = beginDateAsString;
// 	predictionsOpts["range"] = predictionHoursBefore + predictionHoursAfter;

// 	const predictionResponse = await makeJSONRequest<RawResponseWaterLevelPrediction>(predictionsOpts);

// 	const levelResponse = await makeJSONRequest<RawResponse<RawCurrentData>>(specificFetchOptions.currentWaterLevel);

// 	const errors = [...predictionResponse.errors, ...levelResponse.errors];
// 	const warnings = [...predictionResponse.warnings, ...levelResponse.warnings];
// 	let result: NOAAResponse = null;
// 	if (errors.length === 0) {
// 		result = {
// 			predictions: null,//predictionResponse.result.predictions,
// 			waterLevel: null,//levelResponse.result.data[0]
// 		};

// 		result.predictions = predictionResponse.result.predictions.map(function (p) {
// 			return {
// 				time: p.t,
// 				height: parseFloat(p.v),
// 				isLow: p.type === 'L'
// 			}
// 		});

// 		const firstDataWaterLevel = levelResponse.result.data[0];
// 		result.waterLevel = {
// 			time: firstDataWaterLevel.t,
// 			height: parseFloat(firstDataWaterLevel.v)
// 		};
// 	};

// 	return {
// 		result,
// 		errors,
// 		warnings
// 	};
// }

// const predictionHoursBefore = Math.round(24 * 1.5); // 1.5 days before
// const predictionHoursAfter = Math.round(24 * 5.5); // 5.5 days after

// // Required for every request
// const defaultFetchOptions = {
// 	station: 8419317, // Default: Wells, ME https://tidesandcurrents.noaa.gov/stationhome.html?id=8419317
// 	application: "messman_quick-tides-api",
// 	format: "json",
// 	time_zone: "lst_ldt", // Local Time with DST offset
// 	units: "english", // english | metric
// }

// // API documentation: https://tidesandcurrents.noaa.gov/api/
// const api_noaa = "https://tidesandcurrents.noaa.gov/api/datagetter";

// // https://tidesandcurrents.noaa.gov/datums.html?id=8419317
// const datum = "mllw"; // Mean Lower-Low Water

// // Additional parameters required for certain requests
// const specificFetchOptions = {
// 	// Gets the water level **predictions** (may be higher/lower than current! meaning, not always accurate)
// 	waterLevelPrediction: { product: "predictions", datum: datum, interval: "hilo" /* hi/lo, not just 6 minute intervals */ },

// 	// Current...
// 	currentWaterLevel: { product: "water_level", datum: datum, date: "latest" },
// 	//airTemp: { product: "air_temperature", date: "latest" },
// 	//waterTemp: { product: "water_temperature", date: "latest" },
// 	//wind: { product: "wind", date: "latest" },
// 	//airPressure: { product: "air_pressure", date: "latest" },
// };

// async function makeJSONRequest<T>(options: {}): Promise<SingleAPIResponse<T>> {
// 	const url = createRequestUrl(options);

// 	console.log(`Requesting ${url}`);

// 	function handleErr(e: Error): SingleAPIResponse<T> {
// 		return {
// 			result: null,
// 			errors: [{
// 				user: 'A data request failed.',
// 				dev: e.message
// 			}],
// 			warnings: []
// 		}
// 	}

// 	try {
// 		const res = await fetch(url);
// 		if (res.ok) {
// 			const json = await res.json();
// 			if (json["error"]) {
// 				// Returned 200, but had an internal error
// 				return handleErr(new Error(json["error"]["message"]));
// 			}
// 			return {
// 				result: json,
// 				errors: [],
// 				warnings: []
// 			};
// 		}
// 		else {
// 			return handleErr(new Error(`${res.status}: ${res.statusText}`));
// 		}
// 	} catch (e) {
// 		return handleErr(e);
// 	}
// }

// // Takes key-val options, returns a query string
// function createRequestUrl(opts: {}): string {
// 	// Add default options plus additional options
// 	opts = Object.assign({}, defaultFetchOptions, opts);
// 	// Encode to string
// 	const optsString = Object.keys(opts).map(key => `${key}=${encodeURIComponent(opts[key])}`).join("&");
// 	return api_noaa + "?" + optsString;
// }

// // Return a new date with modified hours
// function newDatePlusHours(addHours: number, date: Date): Date {
// 	const newDate = new Date(date.getTime());
// 	newDate.setHours(newDate.getHours() + addHours);
// 	return newDate;
// }

// // Return a formatted date minus X hours
// function formatDateForRequest(d: Date): string {
// 	//yyyyMMdd HH:mm
// 	let twosNum = [d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes()];
// 	const twos = twosNum.map(function (num) {
// 		return num.toString().padStart(2, "0");
// 	});
// 	return `${d.getFullYear()}${twos[0]}${twos[1]} ${twos[2]}:${twos[3]}`;
// }

// interface RawPredictionEvent {
// 	t: string, // Date string, like "2018-07-18 16:33"
// 	v: string, // Value, like "-4.809"
// 	type: "H" | "L"
// }

// interface RawResponse<T> {
// 	data: T[],
// 	metadata: {}
// }

// interface RawCurrentData {
// 	t: string, // Date string, like "2018-07-18 16:33"
// 	v: string, // Value, like "-4.809"
// }

// interface RawResponseWaterLevelPrediction {
// 	predictions: RawPredictionEvent[]
// }

// interface TidePrediction {
// 	time: string,
// 	height: number,
// 	isLow: boolean
// }

// interface TideLevel {
// 	time: string,
// 	height: number
// }