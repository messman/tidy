import { SingleAPIResponse } from "./api";
import fetch from "node-fetch";
import { RequestContext } from "./fetch";

export interface NWSResponse {
	short: ShortWeather[],
	long: LongWeather[],
}

// 43.293,-70.569
// https://api.weather.gov/points/43.293%2C-70.569

// This is for Wells, Maine - url is not coordinates
const apiUrl_Raw = "https://api.weather.gov/gridpoints/GYX/68,39/";
// Period and Hourly have almost everything - not preceipitation.
const apiUrl_Period = "https://api.weather.gov/gridpoints/GYX/68,39/forecast/";
const apiUrl_Hourly = "https://api.weather.gov/gridpoints/GYX/68,39/forecast/hourly/";



export async function getNWSData(context: RequestContext): Promise<SingleAPIResponse<NWSResponse>> {

	const rawResponse = await makeJSONRequest<NWSGridpointRawResponse>(apiUrl_Raw);
	const periodResponse = await makeJSONRequest<NWSGridpointPeriodResponse>(apiUrl_Period);
	const hourlyResponse = await makeJSONRequest<NWSGridpointHourlyResponse>(apiUrl_Hourly);

	let result: NWSResponse = null;
	if (rawResponse.errors.length === 0) {
		result = {
			short: [],
			long: [],
		};

		const tempIterator = iterator(rawResponse.result.properties.temperature.values);
		const skyIterator = iterator(rawResponse.result.properties.skyCover.values);
		const windDirIterator = iterator(rawResponse.result.properties.windDirection.values);
		const windSpeedIterator = iterator(rawResponse.result.properties.windSpeed.values);
		const rainIterator = iterator(rawResponse.result.properties.probabilityOfPrecipitation.values);

		const startHour = context.now.plus({ hours: 1 }).startOf("hour");
		const hours = Math.ceil(context.shortTermCutoff.diff(startHour, "hours").hours);

		const loop = Math.ceil(hours / context.weatherHourGap);

		for (let i = 0; i < loop; i++) {
			const loopDate = startHour.plus({ hours: i * context.weatherHourGap }).toJSDate();

			const short: ShortWeather = {
				time: loopDate,
				temp: tempIterator.getFor(loopDate),
				skyCover: skyIterator.getFor(loopDate),
				windDirection: windDirIterator.getFor(loopDate),
				windSpeed: windSpeedIterator.getFor(loopDate),
				rainChance: rainIterator.getFor(loopDate),
			}

			result.short.push(short);
		}
	};

	return {
		result,
		errors: rawResponse.errors,
		warnings: rawResponse.warnings,
	};
}

async function makeJSONRequest<T>(url: string): Promise<SingleAPIResponse<T>> {
	console.log(`Requesting ${url}`);

	function handleErr(e: Error): SingleAPIResponse<T> {
		return {
			result: null,
			errors: [{
				user: 'A data request failed.',
				dev: e.message
			}],
			warnings: []
		}
	}

	try {
		const res = await fetch(url);
		if (res.ok) {
			const json = await res.json();
			if (json["error"]) {
				// Returned 200, but had an internal error
				return handleErr(new Error(json["error"]["message"]));
			}
			return {
				result: json,
				errors: [],
				warnings: []
			};
		}
		else {
			return handleErr(new Error(`${res.status}: ${res.statusText}`));
		}
	} catch (e) {
		return handleErr(e);
	}
}

interface NWSGridpointRawResponse {
	properties: {
		//updateTime: string,
		//validTimes: string,
		temperature: NWSGridpointRawValueSet<NWSGridpointRawValue>,
		//dewpoint: NWSGridpointRawValueSet<NWSGridpointRawValue>,
		//maxTemperature: NWSGridpointRawValueSet<NWSGridpointRawValue>,
		//minTemperature: NWSGridpointRawValueSet<NWSGridpointRawValue>,
		//relativeHumidity: NWSGridpointRawValueSet<NWSGridpointRawValue>,
		//apparentTemperature: NWSGridpointRawValueSet<NWSGridpointRawValue>,
		//heatIndex: NWSGridpointRawValueSet<NWSGridpointRawValue>,
		//windChill: NWSGridpointRawValueSet<NWSGridpointRawValue>,
		skyCover: NWSGridpointRawValueSet<NWSGridpointRawValue>,
		windDirection: NWSGridpointRawValueSet<NWSGridpointRawValue>,
		windSpeed: NWSGridpointRawValueSet<NWSGridpointRawValue>,
		//windGust: NWSGridpointRawValueSet<NWSGridpointRawValue>,
		probabilityOfPrecipitation: NWSGridpointRawValueSet<NWSGridpointRawValue>,
		//quantitativePrecipitation: NWSGridpointRawValueSet<NWSGridpointRawValue>,
		// more ...
	}
}

interface NWSGridpointRawValueSet<T> {
	sourceUnit: string,
	uom: string,
	values: T[]
}

interface NWSGridpointRawValue {
	validTime: string,
	value: number | null
}

interface NWSGridpointPeriodResponse {
	properties: {
		periods: NWSGridpointPeriod[]
	}
}

interface NWSGridpointPeriod {
	name: string, // Tonight, Friday, etc
	startTime: string,
	endTime: string,
	isDaytime: boolean,
	temperature: number,
	temperatureUnit: string,
	shortForecast: string,
	detailedForecast: string
}

interface NWSGridpointHourlyResponse {
	properties: {
		periods: NWSGridpointHourly[]
	}
}

interface NWSGridpointHourly {
	name: string, // Tonight, Friday, etc
	startTime: string,
	endTime: string,
	isDaytime: boolean,
	temperature: number,
	temperatureUnit: string,
	shortForecast: string,
}

interface ShortWeather {
	time: Date,
	temp: Measurement,
	skyCover: Measurement,
	rainChance: Measurement,
	windSpeed: Measurement,
	windDirection: Measurement,
}

interface LongWeather {
	time: Date,
	tempRange: [number, number],
	skyCoverRange: [number, number],
	rainChanceRange: [number, number]
	windSpeedRange: [number, number]
}

interface Measurement {
	val: number,
	change: Change,
	isComputed: boolean
}

enum Change {
	start,
	lower,
	same,
	higher
}


interface Iterator {
	getFor(time: Date): Measurement
}

function iterator(values: NWSGridpointRawValue[]): Iterator {
	let previous: NWSGridpointRawValue = null;
	let isComputed: boolean = false;
	let nextIndex = 0;
	let next: NWSGridpointRawValue = values[nextIndex];
	let timesCalled = 0;
	let isComplete = false;

	function iterate(newTime: Date): Measurement {
		if (isComplete)
			return null;
		timesCalled++;
		const time = newTime.getTime();
		previous = next;

		let advancedIndex = nextIndex;
		let advancedNext = values[advancedIndex];
		let advancedNextTime: number = getTime(advancedNext);
		while (advancedNextTime < time) {
			advancedIndex++;
			advancedNext = values[advancedIndex];
			if (!advancedNext) {
				isComplete = true;
				return null;
			}
			advancedNextTime = getTime(advancedNext);
		}

		// Now make sure there isn't an issue with duplicate time data
		let dupeIndex = advancedIndex;
		let dupeNext = advancedNext;
		let dupeNextTime = advancedNextTime;
		while (dupeNextTime === advancedNextTime) {
			dupeIndex++;
			dupeNext = values[dupeIndex];
			if (!dupeNext) {
				dupeIndex--;
				break;
			}
			dupeNextTime = getTime(dupeNext);
		}
		if (dupeIndex > advancedIndex + 1) {
			advancedIndex = dupeIndex - 1;
			advancedNext = values[advancedIndex];
			advancedNextTime = getTime(advancedNext);
		}

		// next time is now equal to or greater than necessary time

		if (advancedIndex === nextIndex) {
			// No change
		}
		else {
			if (advancedNextTime === time) {
				// Matching time, new index
				next = advancedNext;
				nextIndex = advancedIndex;
				isComputed = false;
			}
			else {
				// New time is greater than what we wanted.
				// Get the value in the last-before-time and use it to compute a fake value for the time asked for.
				nextIndex = advancedIndex - 1;
				const lastBefore = values[nextIndex];
				const lastBeforeTime = getTime(lastBefore);
				// Note: Our last before may actually be the previous

				const percent = (time - lastBeforeTime) / (advancedNextTime - (lastBeforeTime));
				// Now get that percent between lastBefore and next.
				const value = ((advancedNext.value - lastBefore.value) * percent) + lastBefore.value;
				next = {
					validTime: newTime.toUTCString(),
					value: value
				};
				isComputed = true;
			}
		}

		return {
			val: next.value,
			change: timesCalled === 1 ? Change.start : (next.value > previous.value ? Change.higher : (next.value === previous.value ? Change.same : Change.lower)),
			isComputed: isComputed
		};
	}

	return {
		getFor: iterate
	}
}

function getTime(timeString: NWSGridpointRawValue): number {
	const time = timeString.validTime.slice(0, timeString.validTime.indexOf("/"));
	return (new Date(time)).getTime();
}