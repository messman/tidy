import { APIConfigurationContext } from "../context";
import { SingleAPIResponse, errorIssue } from "../shared/fetch";
import { Measurement, IterableData, TimeSpan, create, IteratorOptions, defaultComputeChange, Iterator, Change } from "../shared/iterator";
import { DateTime, Duration } from "luxon";
import { RootTimeValue, processRootData, getRootData, processHourlyData, getHourlyData, HourlyData } from "./nws-raw";

// 43.293,-70.569
// https://api.weather.gov/points/43.293%2C-70.569

export async function getNWSData(cc: APIConfigurationContext): Promise<SingleAPIResponse<NWSResponse>> {

	// Most pieces of data
	const rootDataResponse = await processRootData(getRootData);
	// Basically just the short description
	const hourlyDataResponse = await processHourlyData(getHourlyData);

	// Our return data
	let nwsResponse: NWSResponse = null;
	const combinedIssues = [...rootDataResponse.issues, ...hourlyDataResponse.issues];

	const rootDataResult = rootDataResponse.result;
	const hourlyDataResult = hourlyDataResponse.result;
	if (rootDataResult && hourlyDataResult) {
		nwsResponse = {
			short: [],
			long: [],
		};

		try {
			// Create iterators for each of the root values, stored independently
			const rainIterator = createRootNumberIterator(rootDataResult.probabilityOfPrecipitation, cc.configuration.timeZoneLabel);
			const skyIterator = createRootNumberIterator(rootDataResult.skyCover, cc.configuration.timeZoneLabel);
			const tempIterator = createRootNumberIterator(rootDataResult.temperature, cc.configuration.timeZoneLabel);
			const windDirIterator = createRootNumberIterator(rootDataResult.windDirection, cc.configuration.timeZoneLabel);
			const windSpeedIterator = createRootNumberIterator(rootDataResult.windSpeed, cc.configuration.timeZoneLabel);

			// Create a single iterator for the "hourly" data
			const hourlyIterableData = hourlyDataResult.map(function (hourlyData: HourlyData) {
				return {
					span: getHourlyTimespan(hourlyData.startTime, hourlyData.endTime, cc.configuration.timeZoneLabel),
					value: hourlyData
				}
			});
			const hourlyDataIterator = create(hourlyIterableData, {
				// We don't care to compute change of a description (for now)
				computeChange: () => Change.same
			});

			// Get the start of the current hour and go from there.
			const startHour = cc.context.timeOfRequest.plus({ hours: 1 }).startOf("hour");
			// Get the hours between our start our and our short-term limit
			const hoursBetween = Math.ceil(cc.context.maxShortTermDataFetch.diff(startHour, "hours").hours);

			const numberOfInterations = Math.ceil(hoursBetween / cc.configuration.weather.hoursGapBetweenWeatherData);

			for (let i = 0; i < numberOfInterations; i++) {
				const dateTime = startHour.plus({ hours: i * cc.configuration.weather.hoursGapBetweenWeatherData });

				const hourlyNext = hourlyDataIterator.next(dateTime);
				let status: string = null;
				let desc: string = null;
				if (hourlyNext) {
					status = getStatusFromIcon(hourlyNext.data.value.icon);
					desc = hourlyNext.data.value.shortForecast;
				}

				const short: ShortWeather = {
					time: dateTime,
					temp: tempIterator.next(dateTime),
					skyCover: skyIterator.next(dateTime),
					windDirection: windDirIterator.next(dateTime), // TODO - I think this is actually a number, not a string
					windSpeed: windSpeedIterator.next(dateTime),
					rainChance: rainIterator.next(dateTime),
					status: status,
					desc: desc
				}

				nwsResponse.short.push(short);
			}
		}
		catch (e) {
			// Bail
			console.log(e);
			combinedIssues.push(errorIssue('There was an error processing the nws data', 'Error in nws iteration', e));
		}
	}
	else {
		combinedIssues.push(errorIssue('There was an error processing the nws data', 'nws root or hourly data was empty'));
	}

	return {
		result: nwsResponse,
		issues: combinedIssues,
	};
}

const nwsIteratorOptions: IteratorOptions<number> = {
	computeChange: defaultComputeChange((data) => data)
};

function createRootNumberIterator(rootTimeValues: RootTimeValue[], timeZone: string): Iterator<number> {
	const iterableData = rootTimeValues.map(function (rootTimeValue: RootTimeValue) {
		return {
			span: getRootTimespan(rootTimeValue.validTime, timeZone),
			value: rootTimeValue.value
		}
	});
	return create(iterableData, nwsIteratorOptions);
}



export function getRootTimespan(timeString: string, timeZone: string): TimeSpan {
	// 2019-07-19T10:00:00+00:00/PT1H means 7/10/2019, 10 AM GMT, for 1 hour
	const separatorIndex = timeString.indexOf("/");
	if (separatorIndex === -1)
		throw new Error('No separator for time span');

	const time = timeString.slice(0, separatorIndex);

	// Length could be "PT12H", "PT6H", "P1D", etc
	const lengthRaw = timeString.slice(separatorIndex + 3); // Leave off the "/PT"
	const matches = timespanRegex.exec(lengthRaw);
	console.log(lengthRaw, matches);
	const timespanTime1 = parseInt(matches[0], 10);
	const timespanLength1 = matches[1] === 'H' ? 1 : 24;

	const timespanTime2 = matches[2] ? parseInt(matches[2], 10) : null;
	const timespanLength2 = matches[3] ? (matches[3] === 'H' ? 1 : 24) : 0;
	const totalHours = (timespanTime1 * timespanLength1) + (timespanTime2 ? (timespanTime2 * timespanLength2) : 0);

	const luxonTime = DateTime.fromISO(time, { zone: timeZone });
	const luxonSpan = Duration.fromObject({ hours: totalHours });
	const luxonEnd = luxonTime.plus(luxonSpan);

	return {
		begin: luxonTime,
		end: luxonEnd
	}
}

function getHourlyTimespan(startTimeString: string, endTimeString: string, timeZone: string): TimeSpan {
	// 2020-01-05T16:00:00-05:00
	const luxonStartTime = DateTime.fromISO(startTimeString, { zone: timeZone });
	const luxonEndTime = DateTime.fromISO(endTimeString, { zone: timeZone });
	return {
		begin: luxonStartTime,
		end: luxonEndTime
	}
}

function getStatusFromIcon(icon: string): string {
	// "https://api.weather.gov/icons/land/day/skc?size=small"
	const lastSlash = icon.lastIndexOf("/");
	let end = icon.substr(lastSlash + 1);
	const qMark = end.indexOf("?");
	if (qMark !== -1) {
		end = end.substr(0, qMark);
	}
	return status[end] || "N/A";
}

export interface NWSResponse {
	short: ShortWeather[],
	long: LongWeather[],
}

interface ShortWeather {
	time: DateTime,
	temp: Measurement<number>,
	skyCover: Measurement<number>,
	rainChance: Measurement<number>,
	windSpeed: Measurement<number>,
	windDirection: Measurement<number>, // degrees
	status: string,
	desc: string
}

interface LongWeather {
	time: DateTime,
	tempRange: [number, number],
	skyCoverRange: [number, number],
	rainChanceRange: [number, number]
	windSpeedRange: [number, number]
}

// Retrieved from https://api.weather.gov/icons
const status = {
	"skc": "Fair/clear",
	"few": "A few clouds",
	"sct": "Partly cloudy",
	"bkn": "Mostly cloudy",
	"ovc": "Overcast",
	"wind_skc": "Fair/clear and windy",
	"wind_few": "A few clouds and windy",
	"wind_sct": "Partly cloudy and windy",
	"wind_bkn": "Mostly cloudy and windy",
	"wind_ovc": "Overcast and windy",
	"snow": "Snow",
	"rain_snow": "Rain/snow",
	"rain_sleet": "Rain/sleet",
	"snow_sleet": "Rain/sleet",
	"fzra": "Freezing rain",
	"rain_fzra": "Rain/freezing rain",
	"snow_fzra": "Freezing rain/snow",
	"sleet": "Sleet",
	"rain": "Rain",
	"rain_showers": "Rain showers (high cloud cover)",
	"rain_showers_hi": "Rain showers (low cloud cover)",
	"tsra": "Thunderstorm (high cloud cover)",
	"tsra_sct": "Thunderstorm (medium cloud cover)",
	"tsra_hi": "Thunderstorm (low cloud cover)",
	"tornado": "Tornado",
	"hurricane": "Hurricane conditions",
	"tropical_storm": "Tropical storm conditions",
	"dust": "Dust",
	"smoke": "Smoke",
	"haze": "Haze",
	"hot": "Hot",
	"cold": "Cold",
	"blizzard": "Blizzard",
	"fog": "Fog/mist"
}