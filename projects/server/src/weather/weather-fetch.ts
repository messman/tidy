import { DateTime, DateTimeOptions } from 'luxon';
import { errorIssue, WeatherStatusType, WindDirection } from 'tidy-shared';
import { APIConfigurationContext } from '../all/context';
import { FetchResponse, getJSON } from '../util/fetch';
import { createServerLog, serverLog } from '../util/log';
import { RunFlags } from '../util/run-flags';
import { createEmptyIntermediateWeather, IntermediateWeatherValues } from './weather-intermediate';

/*
	Uses OpenWeather's free 'One Call API', which replaced multiple calls to the NWS API.
	API key required - sent via RunFlags.

	Documentation:
	https://openweathermap.org/api/one-call-api
	Example (put in the API key):
	https://api.openweathermap.org/data/2.5/onecall?lat=43.294&lon=-70.568&appid=APIKEY&units=imperial

*/

export async function fetchWeather(configContext: APIConfigurationContext, runFlags: RunFlags): Promise<IntermediateWeatherValues> {

	// Make our initial request to get our API URL from the latitude and longitude
	const { latitude, longitude } = configContext.configuration.location;

	const openWeatherResponse = await getOpenWeatherData(latitude, longitude, configContext, runFlags);
	if (openWeatherResponse.issues) {
		return Object.assign({}, createEmptyIntermediateWeather(), {
			errors: {
				errors: openWeatherResponse.issues
			}
		});
	}

	return openWeatherResponse.result!;
}

const openWeatherDataUrl = 'https://api.openweathermap.org/data/2.5/onecall?units=imperial&exclude=minutely';

async function getOpenWeatherData(latitude: number, longitude: number, configContext: APIConfigurationContext, runFlags: RunFlags): Promise<FetchResponse<IntermediateWeatherValues>> {

	const logger = createServerLog(runFlags);

	// Maximum precision is 4 decimal points.
	const fixedLatitude = parseFloat(latitude.toFixed(4));
	const fixedLongitude = parseFloat(longitude.toFixed(4));

	if (!runFlags.keys.weather) {
		// Not set up correctly.
		return {
			issues: [errorIssue('Error retrieving weather information', 'No API Key provided for weather fetch')],
			result: null
		};
	}

	// Don't include API key in log statement, just in case.
	let url = `${openWeatherDataUrl}&lat=${fixedLatitude}&lon=${fixedLongitude}`;
	logger('Starting weather fetch', url);
	url += `&appid=${runFlags.keys.weather}`;

	const fetched = await getJSON<OpenWeatherResponse>(url, 'weather fetch', null);
	logger('Finished weather fetch');
	const { issues, result } = fetched;
	if (issues) {
		// Short-circuit, because it doesn't matter.
		return fetched as unknown as FetchResponse<IntermediateWeatherValues>;
	}

	const response = result!;
	if (response.cod) {
		// Likely an error.
		return {
			issues: [errorIssue('Error retrieving weather information', 'Error returned in weather fetch', { code: response.cod, message: response.message })],
			result: null
		};
	}

	// Per documentation - all times are Unix seconds UTC.
	const zoneOptions: DateTimeOptions = { zone: configContext.configuration.location.timeZoneLabel };

	// Create functions to process the raw data by running conversions and adding precision.
	const temperatureToPrecision = wrapForPrecision(x => x, configContext.configuration.weather.temperaturePrecision);
	const toDefaultPrecision = wrapForPrecision(x => x, configContext.configuration.weather.defaultPrecision);
	const percentToPrecision = wrapForPrecision(toPercent, configContext.configuration.weather.defaultPrecision + 2);
	const metersToPrecisionMiles = wrapForPrecision(metersToMiles, configContext.configuration.weather.defaultPrecision);
	const pressureToPrecisionMillibars = wrapForPrecision(pressureToMillibars, configContext.configuration.weather.defaultPrecision);

	return {
		issues: null,
		result: {
			errors: null,
			warnings: null,
			currentWeather: {
				time: DateTime.fromSeconds(response.current.dt, zoneOptions),
				temp: temperatureToPrecision(response.current.temp),
				tempFeelsLike: temperatureToPrecision(response.current.feels_like),
				wind: toDefaultPrecision(response.current.wind_speed),
				windDirection: degreesToDirection(response.current.wind_deg),
				pressure: pressureToPrecisionMillibars(response.current.pressure),
				cloudCover: percentToPrecision(response.current.clouds),
				visibility: metersToPrecisionMiles(response.current.visibility),
				dewPoint: temperatureToPrecision(response.current.dew_point),
				status: getStatusType(response.current.weather, runFlags)
			},
			shortTermWeather: response.hourly.map((hourly) => {
				return {
					time: DateTime.fromSeconds(hourly.dt, zoneOptions).startOf('hour'),
					temp: temperatureToPrecision(hourly.temp),
					tempFeelsLike: temperatureToPrecision(hourly.feels_like),
					wind: toDefaultPrecision(hourly.wind_speed),
					windDirection: degreesToDirection(hourly.wind_deg),
					pressure: pressureToPrecisionMillibars(hourly.pressure),
					cloudCover: percentToPrecision(hourly.clouds),
					visibility: null,
					dewPoint: temperatureToPrecision(hourly.dew_point),
					status: getStatusType(hourly.weather, runFlags)
				};
			}),
			longTermWeather: response.daily.map((daily) => {
				return {
					day: DateTime.fromSeconds(daily.dt, zoneOptions).startOf('day'),
					minTemp: temperatureToPrecision(daily.temp.min),
					maxTemp: temperatureToPrecision(daily.temp.max),
					status: getStatusType(daily.weather, runFlags)
				};
			}),
		}
	};
}

interface OpenWeatherResponse {
	/** Error code */
	cod: number;
	/** Error message */
	message: string;

	current: {
		/** Unix time, UTC, seconds */
		dt: number;
		/** Temperature, F, two digits past decimal */
		temp: number;
		/** Temperature, F, two digits past decimal */
		feels_like: number;
		/** Atmospheric pressure at sea level, hPa */
		pressure: number;
		/** Dew point, F, two digits past decimal */
		dew_point: number;
		/** Cloudiness, [0,100] percent */
		clouds: number;
		/** Visibility in meters */
		visibility: number;
		/** Wind speed in mph, two digits past decimal */
		wind_speed: number;
		/** Wind direction in degrees (direction coming from - 0 is coming from north) */
		wind_deg: number;
		weather: OpenWeatherWeatherStatus[];
	};
	hourly: OpenWeatherHourlyEntry[];
	daily: OpenWeatherDailyEntry[];
}

interface OpenWeatherHourlyEntry {
	/** Unix time, UTC, seconds */
	dt: number;
	/** Temperature, F, two digits past decimal */
	temp: number;
	/** Temperature, F, two digits past decimal */
	feels_like: number;
	/** Atmospheric pressure at sea level, hPa */
	pressure: number;
	/** Dew point, F, two digits past decimal */
	dew_point: number;
	/** Cloudiness, [0,100] percent */
	clouds: number;
	/** Wind speed in mph, two digits past decimal */
	wind_speed: number;
	/** Wind direction in degrees (direction coming from - 0 is coming from north) */
	wind_deg: number;
	weather: OpenWeatherWeatherStatus[];
}

interface OpenWeatherDailyEntry {
	/** Unix time, UTC, seconds */
	dt: number;
	temp: {
		min: number;
		max: number;
	};
	/** Atmospheric pressure at sea level, hPa */
	pressure: number;
	/** Dew point, F, two digits past decimal */
	dew_point: number;
	/** Cloudiness, [0,100] percent */
	clouds: number;
	/** Wind speed in mph, two digits past decimal */
	wind_speed: number;
	/** Wind direction in degrees (direction coming from - 0 is coming from north) */
	wind_deg: number;
	weather: OpenWeatherWeatherStatus[];
}

interface OpenWeatherWeatherStatus {
	/** Code - see https://openweathermap.org/weather-conditions#Weather-Condition-Codes-2 */
	id: number;
	/** Short name for weather event: Haze, Dust, Mist, Clear */
	main: string;
	/** Longer description for weather event */
	description: string;
	//icon: string;
}

interface ValueConverter<O> {
	(value: any): O;
}

function wrapForPrecision(valueConverter: ValueConverter<number>, precision: number) {
	return function (value: number) {
		const convertedValue = valueConverter(value);
		return parseFloat(convertedValue.toFixed(precision));
	};
}

/** Converts a value in [0, 100] to a value in [0, 1]. */
const toPercent: ValueConverter<number> = (value) => {
	return value / 100;
};

/** Converts angle degrees to cardinal directions. */
const degreesToDirection: ValueConverter<WindDirection> = (value: number) => {
	// We are presuming that 0 degrees is N.
	// 90 degrees is N to E, 45 is N to NE, 22.5 is N to NNE, 11.5 is to halfway between N and NNE.
	// Use that logic to convert from number [0, 360] to direction.

	let directionValue = Math.floor((value + 11.25) / 22.5);
	if (directionValue === 16) {
		directionValue = 0;
	}
	return directionValue as WindDirection;
};

/** Converts meters to miles. */
const metersToMiles: ValueConverter<number> = (value) => {
	return value * 0.0006213;
};

/** Converts hPa (100 Pa) to mb (100 Pa). */
const pressureToMillibars: ValueConverter<number> = (value) => {
	return value;
};

function getStatusType(statuses: OpenWeatherWeatherStatus[], runFlags: RunFlags): WeatherStatusType {
	if (!statuses.length) {
		serverLog(runFlags, 'No statuses provided');
	}
	const statusNumbers = statuses.map((status) => {
		return status.id;
	});
	if (statusNumbers.length > 1 || statusNumbers[0] === 0) {
		serverLog(runFlags, 'Multiple statuses provided', statusNumbers);
	}
	let statusNumber = statusNumbers[0];

	const status = openWeatherStatusMap[statusNumber as keyof typeof openWeatherStatusMap] || WeatherStatusType.unknown;
	if (status === WeatherStatusType.unknown) {
		serverLog(runFlags, `Weather status is unknown due to mismatch of ID [${statusNumber}]`);
	}
	return status;
}

// Retrieved from https://openweathermap.org/weather-conditions#Weather-Condition-Codes-2
const openWeatherStatusMap = {
	// Thunderstorm
	200: WeatherStatusType.thun_light,
	201: WeatherStatusType.thun_medium,
	202: WeatherStatusType.thun_heavy,
	210: WeatherStatusType.thun_light,
	211: WeatherStatusType.thun_medium,
	212: WeatherStatusType.thun_heavy,
	221: WeatherStatusType.thun_medium,
	230: WeatherStatusType.thun_light,
	231: WeatherStatusType.thun_medium,
	232: WeatherStatusType.thun_heavy,

	// Drizzle
	300: WeatherStatusType.rain_drizzle,
	301: WeatherStatusType.rain_drizzle,
	302: WeatherStatusType.rain_drizzle,
	310: WeatherStatusType.rain_drizzle,
	311: WeatherStatusType.rain_drizzle,
	312: WeatherStatusType.rain_drizzle,
	313: WeatherStatusType.rain_drizzle,
	314: WeatherStatusType.rain_drizzle,
	321: WeatherStatusType.rain_drizzle,

	// Rain
	500: WeatherStatusType.rain_light,
	501: WeatherStatusType.rain_medium,
	502: WeatherStatusType.rain_heavy,
	503: WeatherStatusType.rain_heavy,
	504: WeatherStatusType.rain_heavy,
	511: WeatherStatusType.rain_freeze,
	520: WeatherStatusType.rain_light,
	521: WeatherStatusType.rain_medium,
	522: WeatherStatusType.rain_heavy,
	531: WeatherStatusType.rain_medium,

	// Snow
	600: WeatherStatusType.snow_light,
	601: WeatherStatusType.snow_medium,
	602: WeatherStatusType.snow_heavy,
	611: WeatherStatusType.snow_sleet,
	612: WeatherStatusType.snow_sleet,
	613: WeatherStatusType.snow_sleet,
	615: WeatherStatusType.snow_rain,
	616: WeatherStatusType.snow_rain,
	620: WeatherStatusType.snow_rain,
	621: WeatherStatusType.snow_rain,
	622: WeatherStatusType.snow_rain,

	// Atmosphere
	701: WeatherStatusType.fog,
	711: WeatherStatusType.smoke,
	721: WeatherStatusType.haze,
	731: WeatherStatusType.dust,
	741: WeatherStatusType.fog,
	751: WeatherStatusType.dust,
	761: WeatherStatusType.dust,
	762: WeatherStatusType.dust,
	771: WeatherStatusType.intense_other,
	781: WeatherStatusType.intense_storm,

	// Clear
	800: WeatherStatusType.clear,

	// Clouds
	801: WeatherStatusType.clouds_few,
	802: WeatherStatusType.clouds_some,
	803: WeatherStatusType.clouds_most,
	804: WeatherStatusType.clouds_over
};