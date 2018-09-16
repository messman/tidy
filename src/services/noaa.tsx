import { rejects } from "assert";

const noaaUri = "api/proxy/noaa/latest";

export function getNoaaData(minTimeMs: number): Promise<Response> {
	return wrapPromise(fetch(noaaUri)
		.then((res) => {
			if (res.ok) {
				return res.json()
					.then((json) => {
						return parseJsonToResponse(json.response);
					})
					.catch((err) => {
						throw new Error("There was a problem deserializing the API response");
					});
			}
			else {
				if (res.status === 404) {
					throw new Error("The application could not connect to the API (404)");
				}
				throw new Error(`The API experienced an error (${res.status})`);
			}
		})
		.catch((err) => {
			if (!(err instanceof Error)) {
				err = new Error(err);
			}
			console.error(noaaUri, err);
			throw err;
		}), minTimeMs);
}

function timeoutPromise<S>(val: S, pass: boolean, timeout: number): Promise<S> {
	return new Promise((res, rej) => {
		setTimeout(() => {
			if (pass)
				res(val);
			else
				rej(val);
		}, timeout);
	});
}

// Delays a promise, including its error.
function wrapPromise<T>(promise: Promise<T>, time: number): Promise<T> {
	const now = Date.now();
	return promise
		.then((val) => {
			const diff = Date.now() - now;
			if (diff < time)
				return timeoutPromise(val, true, time - diff);
			else
				return val;
		})
		.catch((err) => {
			const diff = Date.now() - now;
			if (diff < time)
				return timeoutPromise(err, false, time - diff);
			else
				return err;
		});
}

function parseJsonToResponse(json: any): Response {
	const parsed: Response = {
		tzo: json.tzo,
		errors: json.errors,
		data: {
			waterLevel: null,
			current: {
				airPressure: null,
				airTemp: null,
				waterTemp: null,
				wind: null
			}
		}
	}

	if (!!json.data.waterLevel) {
		const waterLevelJson = json.data.waterLevel;
		parsed.data.waterLevel = {
			predictionsBeforeCurrent: waterLevelJson.predictionsBeforeCurrent.map(parseJsonToPrediction),
			previous: parseJsonToPrediction(waterLevelJson.previous),
			current: parseJsonToCurrentData(waterLevelJson.current),
			currentIsRising: waterLevelJson.currentIsRising,
			currentPercentFallen: waterLevelJson.currentPercentFallen,
			next: parseJsonToPrediction(waterLevelJson.next),
			high: parseJsonToPrediction(waterLevelJson.high),
			low: parseJsonToPrediction(waterLevelJson.low),
			predictionsAfterCurrent: waterLevelJson.predictionsAfterCurrent.map(parseJsonToPrediction),
		}
	}

	if (!!json.data.current.airPressure)
		parsed.data.current.airPressure = parseJsonToCurrentData(json.data.current.airPressure);

	if (!!json.data.current.airTemp)
		parsed.data.current.airTemp = parseJsonToCurrentData(json.data.current.airTemp);

	if (!!json.data.current.waterTemp)
		parsed.data.current.waterTemp = parseJsonToCurrentData(json.data.current.waterTemp);

	if (!!json.data.current.wind) {
		const windJson = json.data.current.wind;
		parsed.data.current.wind = {
			time: new Date(windJson.time),
			direction: windJson.direction,
			directionCardinal: windJson.directionCardinal,
			gust: windJson.gust,
			speed: windJson.speed
		};
	}

	console.log(parsed);
	return parsed;
}

function parseJsonToPrediction(json: any): WaterLevelPrediction {
	const currentData = parseJsonToCurrentData(json) as any;
	currentData.isHigh = json.isHigh;
	return currentData;
}

function parseJsonToCurrentData(json: any): CurrentData {
	return {
		time: parseTimeFromResponse(json.time),
		val: json.val
	}
}

function parseTimeFromResponse(timeString: string): Date {
	// Parse for Safari
	// year-month-date HH:mm
	timeString = timeString.trim();
	const parts = timeString.split(" ");
	const date = parts[0];
	const dateParts = date.split("-");
	const year = parseInt(dateParts[0], 10);
	const month = parseInt(dateParts[1], 10);
	const dateDay = parseInt(dateParts[2], 10);

	const time = parts[1];
	const timeParts = time.split(":");
	const hours = parseInt(timeParts[0], 10);
	const minutes = parseInt(timeParts[1], 10);

	const newDate = new Date();
	newDate.setFullYear(year, month - 1, dateDay);
	newDate.setHours(hours);
	newDate.setMinutes(minutes);
	newDate.setSeconds(0);
	newDate.setMilliseconds(0);

	return newDate;
}

//
//
/// BELOW copied from api project (proxy/noaa/models)
//
//

export interface CurrentData {
	time: Date,
	val: number
}

export interface WaterLevelPrediction extends CurrentData {
	isHigh: boolean
}

export interface JSONError {
	errText: string,
	errContext: string
}

export interface Response {
	tzo: number, // time zone offset, for debugging
	errors: JSONError[],
	data: {
		waterLevel: {
			predictionsBeforeCurrent: WaterLevelPrediction[],
			previous: WaterLevelPrediction,
			current: CurrentData,
			currentIsRising: boolean,
			currentPercentFallen: number, // [0,1]. Adjusted to be between low and high
			next: WaterLevelPrediction,
			high: WaterLevelPrediction, // May be next or previous
			low: WaterLevelPrediction, // May be next or previous
			predictionsAfterCurrent: WaterLevelPrediction[],
		},
		current: {
			airPressure: CurrentData,
			airTemp: CurrentData,
			waterTemp: CurrentData,
			wind: {
				time: Date,
				direction: number,
				directionCardinal: string,
				gust: number,
				speed: number
			}
		}
	}
}

//
//
/// ABOVE copied from api project (proxy/noaa/models)
//
//