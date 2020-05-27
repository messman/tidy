import { APIConfigurationContext } from "../all/context";
import { errorIssue, WeatherStatusType, WindDirection } from "tidy-shared";
import { getJSON, FetchResponse } from "../util/fetch";
import { mergeIssues } from "../all/all-merge";
import { DateTime, Duration } from "luxon";
import { IntermediateWeatherValues, createEmptyIntermediateWeather } from "./weather-intermediate";
import { TimeSpan, IterableTimeData } from "../util/iterator";

/*
	From https://www.weather.gov/documentation/services-web-api
	More info: https://weather-gov.github.io/api/general-faqs

	Process:
	Do initial request for 'discovery' based on latitude/longitude
	Do secondary request with URL returned in discovery response.

	Sample URLs:
	First:
	https://api.weather.gov/points/43.29,-70.57

	Second:
	https://api.weather.gov/gridpoints/GYX/68,39
	https://api.weather.gov/gridpoints/GYX/68,39/forecast/hourly
	https://api.weather.gov/gridpoints/GYX/68,39/forecast (unused)
*/

export async function fetchWeather(configContext: APIConfigurationContext): Promise<IntermediateWeatherValues> {

	// Make our initial request to get our API URL from the latitude and longitude
	const { latitude, longitude } = configContext.configuration.location;

	const coordinateLookupResponse = await getForecastURLFromCoordinates(latitude, longitude);
	if (coordinateLookupResponse.issues) {
		return Object.assign({}, createEmptyIntermediateWeather(), {
			errors: {
				errors: coordinateLookupResponse.issues
			}
		});
	}

	const forecastURLs = coordinateLookupResponse.result!;
	const intermediateWeatherResponse = await getIntermediateWeather(configContext, forecastURLs.grid, forecastURLs.period);
	if (intermediateWeatherResponse.issues) {
		return Object.assign({}, createEmptyIntermediateWeather(), {
			errors: {
				errors: intermediateWeatherResponse.issues
			}
		});
	}

	return intermediateWeatherResponse.result!;
}

const commonHeaders = {
	// Per the request of the weather API
	'User-Agent': 'andrewmessier.com, andrewgmessier@gmail.com'
};

const coordinateLookupUrl = 'https://api.weather.gov/points/';

interface CoordinateLookupResponse {
	/** Error status. */
	status: number | null,
	/** Error detail. */
	detail: string | null,

	properties: {
		//forecast: string,

		/** URL to provide information just on periods of time for the given area (status, short forecast). */
		forecastHourly: string,

		/** URL to provide information on each data point for the given area. */
		forecastGridData: string

		//timeZone: string
	},
}

interface ForecastURLs {
	period: string,
	grid: string
}

async function getForecastURLFromCoordinates(latitude: number, longitude: number): Promise<FetchResponse<ForecastURLs>> {
	// Maximum precision is 4 decimal points.
	const fixedLatitude = parseFloat(latitude.toFixed(4));
	const fixedLongitude = parseFloat(longitude.toFixed(4));
	const url = `${coordinateLookupUrl}${fixedLatitude},${fixedLongitude}`;

	const fetched = await getJSON<CoordinateLookupResponse>(url, 'weather coordinate lookup', commonHeaders);
	const { issues, result } = fetched;
	if (issues) {
		// Short-circuit, because it doesn't matter.
		return fetched as unknown as FetchResponse<ForecastURLs>;
	}

	if (result!.detail) {
		// Likely an error.
		return {
			issues: [errorIssue('Error retrieving weather information', 'Error in weather coordinate lookup', { status: result!.status, detail: result!.detail })],
			result: null
		}
	}

	return {
		issues: null,
		result: {
			period: result!.properties.forecastHourly,
			grid: result!.properties.forecastGridData
		}
	}
}

/** Time, of form 2020-04-21T07:00:00+00:00 */
type ISOTimeString = string;
/** Time, of form 2020-04-21T07:00:00+00:00/PT1H */
type ISODurationString = string;

interface GridForecastResponse {
	properties: {
		updateTime: ISOTimeString,
		validTimes: ISODurationString,

		temperature: GridForecastEntity<number>,
		apparentTemperature: GridForecastEntity<number>,
		probabilityOfPrecipitation: GridForecastEntity<number>,
		windDirection: GridForecastEntity<string>,
		windSpeed: GridForecastEntity<number>,
		dewpoint: GridForecastEntity<number>,
		skyCover: GridForecastEntity<number>,
		visibility: GridForecastEntity<number>,
	},
}

interface GridForecastEntity<T> {
	values: GridForecastEntityValue<T>[]
}

interface GridForecastEntityValue<T> {
	validTime: ISODurationString,
	value: T
}

interface PeriodForecastResponse {
	properties: {
		updateTime: ISOTimeString,
		validTimes: ISODurationString,

		periods: PeriodForecastEntity[]
	},
}

interface PeriodForecastEntity {
	startTime: ISOTimeString,
	endTime: ISOTimeString,
	icon: string,
	shortForecast: string
}

async function getIntermediateWeather(configContext: APIConfigurationContext, gridURL: string, periodURL: string): Promise<FetchResponse<IntermediateWeatherValues>> {

	const requests: [Promise<FetchResponse<GridForecastResponse>>, Promise<FetchResponse<PeriodForecastResponse>>] = [
		getJSON<GridForecastResponse>(gridURL, 'weather grid forecast lookup', commonHeaders),
		getJSON<PeriodForecastResponse>(periodURL, 'weather period forecast lookup', commonHeaders)
	];

	const [gridForecastResponse, periodForecastResponse] = await Promise.all(requests);

	const combinedIssues = mergeIssues([gridForecastResponse.issues, periodForecastResponse.issues]);
	if (combinedIssues) {
		return {
			issues: combinedIssues,
			result: null
		}
	}

	const timeZone = configContext.configuration.location.timeZoneLabel;
	const { temperature, apparentTemperature, probabilityOfPrecipitation, windDirection, windSpeed, dewpoint, skyCover, visibility } = gridForecastResponse.result!.properties;

	// Create functions to process the raw data by running conversions and adding precision.
	const temperatureToPrecisionFahrenheit = wrapForPrecision(temperatureCelsiusToFahrenheit, configContext.configuration.weather.temperaturePrecision);
	const percentToPrecision = wrapForPrecision(toPercent, configContext.configuration.weather.defaultPrecision + 2);
	const windToPrecisionMiles = wrapForPrecision(windMetersPerSecondToMilesPerHour, configContext.configuration.weather.defaultPrecision);
	const metersToPrecisionMiles = wrapForPrecision(metersToMiles, configContext.configuration.weather.defaultPrecision);

	const periods = periodForecastResponse.result!.properties.periods.map<IterableTimeData<WeatherStatusType>>((e) => {
		return {
			span: timeSpanFromTimes(e.startTime, e.endTime, timeZone),
			value: getStatusFromIcon(e.icon)
		}
	});

	return {
		issues: null,
		result: {
			errors: null,
			warnings: null,
			temp: createIterableData(temperature, timeZone, temperatureToPrecisionFahrenheit),
			tempFeelsLike: createIterableData(apparentTemperature, timeZone, temperatureToPrecisionFahrenheit),
			chanceRain: createIterableData(probabilityOfPrecipitation, timeZone, percentToPrecision),
			windDirection: createIterableData(windDirection, timeZone, degreesToDirection),
			wind: createIterableData(windSpeed, timeZone, windToPrecisionMiles),
			dewPoint: createIterableData(dewpoint, timeZone, temperatureToPrecisionFahrenheit),
			cloudCover: createIterableData(skyCover, timeZone, percentToPrecision),
			visibility: createIterableData(visibility, timeZone, metersToPrecisionMiles),
			status: periods
		}
	}

}

function createIterableData<T>(gridForecastEntity: GridForecastEntity<any>, timeZone: string, valueConversion: ValueConverter<T>): IterableTimeData<T>[] {
	return gridForecastEntity.values.map((e) => {
		return {
			span: timeSpanFromString(e.validTime, timeZone),
			value: valueConversion(e.value)
		}
	});
}

interface ValueConverter<O> {
	(value: any): O
}

function wrapForPrecision(valueConverter: ValueConverter<number>, precision: number) {
	return function (value: number) {
		const convertedValue = valueConverter(value);
		return parseFloat(convertedValue.toFixed(precision));
	}
}

/** Converts temperature from celsius to fahrenheit. */
const temperatureCelsiusToFahrenheit: ValueConverter<number> = (value) => {
	return value * (9 / 5) + 32;
};

/** Converts a value in [0, 100] to a value in [0, 1]. */
const toPercent: ValueConverter<number> = (value) => {
	return value / 100;
};

/** Converts angle degrees to cardinal directions. */
const degreesToDirection: ValueConverter<WindDirection> = (value: number) => {
	// We are presuming that 0 degrees is N.
	// 90 degrees is N to E, 45 is N to NE, 22.5 is N to NNE, 11.5 is to halfway between N and NNE.
	// Use that logic to convert from number [0, 360] to direction.

	const clampedValue = value === 360 ? 0 : value;
	const directionValue = Math.floor((clampedValue + 11.25) / 22.5);
	return directionValue as WindDirection;
};

/** Converts wind speed meters/second to miles/hour. */
const windMetersPerSecondToMilesPerHour: ValueConverter<number> = (value) => {
	return value * 2.23694;
};

/** Converts meters to miles. */
const metersToMiles: ValueConverter<number> = (value) => {
	return value * 0.0006213;
};



//const timespanRegex = /([0-9]+)([a-zA-Z])([0-9]*)([a-zA-Z]?)/;
/** Parse a timeSpan from a single string that gives a time and a duration. */
function timeSpanFromString(timeString: string, timeZone: string): TimeSpan {
	// 2019-07-19T10:00:00+00:00/PT1H means 7/10/2019, 10 AM GMT, for 1 hour
	const separatorIndex = timeString.indexOf("/");
	if (separatorIndex === -1)
		throw new Error('No separator for time span');

	const time = timeString.slice(0, separatorIndex);

	// Length could be "PT12H", "PT6H", "P1D", etc
	const duration = Duration.fromISO(timeString.substr(separatorIndex + 1)); // Leave off the "/"
	// const matches = timespanRegex.exec(lengthRaw)!;
	// console.log(lengthRaw, matches);
	// const timespanTime1 = parseInt(matches[0], 10);
	// const timespanLength1 = matches[1] === 'H' ? 1 : 24;

	// const timespanTime2 = matches[2] ? parseInt(matches[2], 10) : null;
	// const timespanLength2 = matches[3] ? (matches[3] === 'H' ? 1 : 24) : 0;
	// const totalHours = (timespanTime1 * timespanLength1) + (timespanTime2 ? (timespanTime2 * timespanLength2) : 0);

	const luxonTime = DateTime.fromISO(time, { zone: timeZone });
	const luxonEnd = luxonTime.plus(duration);

	return {
		begin: luxonTime,
		end: luxonEnd
	}
}

function timeSpanFromTimes(startTimeString: string, endTimeString: string, timeZone: string): TimeSpan {
	// 2020-01-05T16:00:00-05:00
	// Parse using whatever offset is presented in the string, but convert to the given zone.
	const luxonStartTime = DateTime.fromISO(startTimeString, { zone: timeZone });
	const luxonEndTime = DateTime.fromISO(endTimeString, { zone: timeZone });
	return {
		begin: luxonStartTime,
		end: luxonEndTime
	}
}

function getStatusFromIcon(iconUrl: string): WeatherStatusType {
	// "https://api.weather.gov/icons/land/day/skc?size=small"
	const lastSlashIndex = iconUrl.lastIndexOf('/');
	if (lastSlashIndex === -1) {
		return WeatherStatusType.unknown;
	}
	// May be a comma or a question mark.
	const commaIndex = iconUrl.indexOf(',');
	const qMarkIndex = iconUrl.indexOf('?');

	let icon: string = null!;
	if (commaIndex !== -1) {
		icon = iconUrl.substring(lastSlashIndex + 1, commaIndex);
	}
	else if (qMarkIndex !== -1) {
		icon = iconUrl.substring(lastSlashIndex + 1, qMarkIndex);
	}
	else {
		icon = iconUrl.substring(lastSlashIndex + 1);
	}

	const weatherIconKey = icon as keyof typeof weatherIconStatuses;
	const weatherIconStatus = weatherIconStatuses[weatherIconKey];
	return weatherIconStatus || WeatherStatusType.unknown;
}

// Retrieved from https://api.weather.gov/icons
const weatherIconStatuses = {
	"skc": WeatherStatusType.fair,
	"few": WeatherStatusType.cloud_few,
	"sct": WeatherStatusType.cloud_part,
	"bkn": WeatherStatusType.cloud_most,
	"ovc": WeatherStatusType.cloud_over,
	"wind_skc": WeatherStatusType.wind_fair,
	"wind_few": WeatherStatusType.wind_few,
	"wind_sct": WeatherStatusType.wind_part,
	"wind_bkn": WeatherStatusType.wind_most,
	"wind_ovc": WeatherStatusType.wind_over,
	"snow": WeatherStatusType.snow,
	"rain_snow": WeatherStatusType.rain_snow,
	"rain_sleet": WeatherStatusType.rain_sleet,
	"snow_sleet": WeatherStatusType.snow_sleet,
	"fzra": WeatherStatusType.rain_freeze,
	"rain_fzra": WeatherStatusType.rain_freeze_rain,
	"snow_fzra": WeatherStatusType.snow_freeze_rain,
	"sleet": WeatherStatusType.sleet,
	"rain": WeatherStatusType.rain,
	"rain_showers": WeatherStatusType.rain_showers_high,
	"rain_showers_hi": WeatherStatusType.rain_showers,
	"tsra": WeatherStatusType.thun_high,
	"tsra_sct": WeatherStatusType.thun_med,
	"tsra_hi": WeatherStatusType.thun_low,
	"tornado": WeatherStatusType.torn,
	"hurricane": WeatherStatusType.hurr,
	"tropical_storm": WeatherStatusType.trop,
	"dust": WeatherStatusType.dust,
	"smoke": WeatherStatusType.smoke,
	"haze": WeatherStatusType.haze,
	"hot": WeatherStatusType.hot,
	"cold": WeatherStatusType.cold,
	"blizzard": WeatherStatusType.blizz,
	"fog": WeatherStatusType.fog
};