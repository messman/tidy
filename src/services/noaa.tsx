import { DEFINE } from "./define";
import { TimeHTMLAttributes } from "react";

// API documentation: https://tidesandcurrents.noaa.gov/api/
const api_noaa = "https://tidesandcurrents.noaa.gov/api/datagetter";

// Required for every request
const default_fetch_options = {
	station: 8419317, // Default: Wells, ME https://tidesandcurrents.noaa.gov/stationhome.html?id=8419317
	application: "messman_quick-tides",
	format: "json",
	time_zone: "lst_ldt", // Local Time with DST offset
	units: "english", // english | metric
}

// Takes key-val options, returns a query string
function createRequest(opts): string {
	// Add default options plus additional options
	opts = Object.assign({}, default_fetch_options, opts);
	// Encode to string
	const optsString = Object.keys(opts).map(key => `${key}=${encodeURIComponent(opts[key])}`).join("&");
	return api_noaa + "?" + optsString;
}

// Additional parameters required for certain requests
const products = {
	water_level_prediction: { product: "predictions", datum: "mtl", interval: "hilo" /* hi/lo, not just 6 minute intervals */ },
	water_level: { product: "water_level", datum: "mtl", date: "latest" },
	air_temp: { product: "air_temperature", date: "latest" },
	water_temp: { product: "water_temperature", date: "latest" },
	wind: { product: "wind", date: "latest" },
}

// Return a new date with modified hours
function newDatePlusHours(addHours: number, date?: Date): Date {
	let newDate: Date = null;
	if (date)
		newDate = new Date(date.getTime());
	else
		newDate = new Date();

	date.setHours(date.getHours() + addHours);
	return date;
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

// To track all requests for our app's refresh buttons
export interface Response {
	timeOfRequest: Date,
	errors: Error[]
}

// Raw response from Water Level Prediction request
interface RawWaterLevelPredictionResponse {
	predictions: RawWaterLevelPrediction[]
}

interface RawWaterLevelPrediction {
	t: string, // Date, like "2018-07-18 16:33"
	v: string, // Value, like "-4.809"
	type: "H" | "L"
}

export interface WaterLevelPrediction {
	time: Date,
	val: number,
	isHigh: boolean
}

interface RawCurrentWaterLevelResponse {
	// Array should be of length 1
	data: RawCurrentWaterLevel[]
}

interface RawCurrentWaterLevel {
	t: string, // Date, like "2018-07-18 16:33"
	v: string, // Value, like "-4.809"
	//s: string,
	//f: string,
	//q: string
}

export interface CurrentWaterLevel {
	time: Date,
	val: number
}

export interface WaterLevelResponse extends Response {
	predictions: WaterLevelPrediction[],
	current: CurrentWaterLevel
}

export interface WaterLevel extends Response {
	predictionsBeforeCurrent: WaterLevelPrediction[],
	previous: WaterLevelPrediction,
	current: CurrentWaterLevel,
	currentIsRising: boolean,
	next: WaterLevelPrediction,
	predictionsAfterCurrent: WaterLevelPrediction[],
}

function makeRequest(options): Promise<any> {
	const url = createRequest(options);
	return fetch(url)
		.then((response) => {
			if (response.ok)
				return response.json();
			else
				return Promise.reject(response);
		});
}

export function getWaterLevelData(date?: Date, predictionHoursRadius?: number): Promise<WaterLevel> {
	if (!date)
		date = new Date();
	if (!predictionHoursRadius) // empty or negative
		predictionHoursRadius = default_predictionHoursRadius;

	if (!DEFINE.BUILD.IS_PRODUCTION && DEFINE.DEBUG.LOCAL_REQUEST_DATA) {
		const fakeResponse: WaterLevelResponse = {
			timeOfRequest: parseTimeFromResponse("2018-07-19 10:14"),
			predictions: [
				{ time: parseTimeFromResponse("2018-07-18 10:07"), val: -5.491, isHigh: false },
				{ time: parseTimeFromResponse("2018-07-18 16:33"), val: 5.273, isHigh: true },
				{ time: parseTimeFromResponse("2018-07-18 22:37"), val: -4.809, isHigh: false },
				{ time: parseTimeFromResponse("2018-07-19 04:56"), val: 5.013, isHigh: true },
				{ time: parseTimeFromResponse("2018-07-19 11:05"), val: -4.995, isHigh: false },
				{ time: parseTimeFromResponse("2018-07-19 17:30"), val: 5.095, isHigh: true },
				{ time: parseTimeFromResponse("2018-07-19 23:41"), val: -4.536, isHigh: false },
				{ time: parseTimeFromResponse("2018-07-20 05:57"), val: 4.432, isHigh: true }
			],
			current: {
				time: parseTimeFromResponse("2018-07-19 09:54"),
				val: -3.776
			},
			errors: null
		}
		const fakeLevel = parseWaterLevel(fakeResponse);
		console.log(fakeLevel);
		return Promise.resolve(fakeLevel);
	}

	// Update the water_level_prediction to be X hours before and X hours after
	const predictionsOpts = Object.assign({}, products["water_level_prediction"]);
	const requestDate = date;
	const beginDate = newDatePlusHours(-predictionHoursRadius, requestDate);
	const beginDateAsString = formatDateForRequest(beginDate);
	predictionsOpts["begin_date"] = beginDateAsString;
	predictionsOpts["range"] = predictionHoursRadius * 2;

	const response: WaterLevelResponse = {
		timeOfRequest: requestDate,
		predictions: null,
		current: null,
		errors: null
	}

	const predictionPromise = makeRequest(predictionsOpts)
		.then((json: RawWaterLevelPredictionResponse) => {
			// Create the processed data
			response.predictions = json.predictions.map((p) => {
				return {
					time: parseTimeFromResponse(p.t),
					val: parseFloat(p.v),
					isHigh: p.type.toUpperCase() === "H"
				}
			});
		})
		.catch((e) => {
			if (!response.errors || !response.errors.length)
				response.errors = [];
			response.errors.push(new Error(e));
		});

	const currentLevelPromise = makeRequest(products.water_level)
		.then((json: RawCurrentWaterLevelResponse) => {
			// Create the processed data
			response.current = json.data.map((d) => {
				return {
					time: parseTimeFromResponse(d.t),
					val: parseFloat(d.v)
				}
			})[0];
		})
		.catch((e) => {
			if (!response.errors || !response.errors.length)
				response.errors = [];
			response.errors.push(new Error(e));
		});

	return Promise.all([predictionPromise, currentLevelPromise]).then(() => {
		// response object should be ready
		const waterLevel = parseWaterLevel(response);
		if (!DEFINE.BUILD.IS_PRODUCTION)
			console.log(waterLevel);
		return waterLevel;
	});
}

const default_predictionHoursRadius = 24;

function parseTimeFromResponse(timeString: any) {
	// Parse for Safari
	// year-month-date HH:mm
	timeString = timeString.trim();
	const parts = timeString.split(" ");
	const date = parts[0];
	const dateParts = date.split("-");
	const year = dateParts[0];
	const month = dateParts[1];
	const dateDay = dateParts[2];

	const time = parts[1];
	const timeParts = time.split(":");
	const hours = timeParts[0];
	const minutes = timeParts[1];

	const newDate = new Date();
	newDate.setFullYear(year, month - 1, dateDay);
	newDate.setHours(hours);
	newDate.setMinutes(minutes);
	newDate.setSeconds(0);
	newDate.setMilliseconds(0);

	return newDate;
}

function parseWaterLevel(response: WaterLevelResponse): WaterLevel {
	const waterLevel: WaterLevel = {
		predictionsBeforeCurrent: null,
		previous: null,
		current: response.current,
		currentIsRising: false,
		next: null,
		predictionsAfterCurrent: null,
		errors: response.errors,
		timeOfRequest: response.timeOfRequest
	}

	if (!response.errors) {
		// Find where the current level is in the predictions
		let indexOfClosestBefore: number = 0;
		const currentTime = response.current.time.getTime();
		let minTimeDiff = Infinity;
		for (let i = 0; i < response.predictions.length; i++) {
			const prediction = response.predictions[i];
			const diff = currentTime - prediction.time.getTime();
			if (diff < 0)
				break;
			if (diff < minTimeDiff) {
				indexOfClosestBefore = i;
				minTimeDiff = diff;
			}
		}

		waterLevel.predictionsBeforeCurrent = response.predictions.slice(0, indexOfClosestBefore + 1);
		waterLevel.previous = response.predictions[indexOfClosestBefore];
		waterLevel.currentIsRising = !waterLevel.previous.isHigh;
		waterLevel.next = response.predictions[indexOfClosestBefore + 1];
		waterLevel.predictionsAfterCurrent = response.predictions.slice(indexOfClosestBefore + 1);
	}

	return waterLevel;
}