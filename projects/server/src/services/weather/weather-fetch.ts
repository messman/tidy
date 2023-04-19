import { DateTime, DateTimeOptions } from 'luxon';
import { Astro, constant, isServerError, Weather } from '@wbtdevlocal/iso';
import { serverErrors, ServerPromise } from '../../api/error';
import { settings } from '../../env';
import { BaseConfig } from '../config';
import { LogContext } from '../logging/pino';
import { makeRequest } from '../network/request';
import { FetchedWeather, fixFetchedWeather, getIndicator, WithoutIndicator } from './weather-shared';

import StatusType = Weather.StatusType;

/*
	Uses OpenWeather's free 'One Call API', which replaced multiple calls to the NWS API.

	- API key required.
	- Limit of 950 requests per day (1 per 2 minutes)
		- Controlled at the service, so we'll get error codes instead of getting stuck auto-paying if
			we go over the amount
	- Provides:
		- Current weather
		- Hourly forecast for 48 hours
		- Daily forecast for 8 days

	History:
	- Using api v3.0 since June 2022 (moved not for new features, but in case old API was going to shut down)
	- Used api v2.5 until June 2022

	Documentation:
	https://openweathermap.org/api/one-call-3
	Example (put in the API key):
	https://api.openweathermap.org/data/3.0/onecall?lat=43.294&lon=-70.568&appid=APIKEY&units=imperial

*/
const openWeatherDataUrl = 'https://api.openweathermap.org/data/3.0/onecall?units=imperial&exclude=minutely';

export async function readWeather(ctx: LogContext, config: BaseConfig): ServerPromise<FetchedWeather> {
	const fetchedWeather = await fetchWeather(ctx, config);
	if (isServerError(fetchedWeather)) {
		return fetchedWeather;
	}
	return fixFetchedWeather(config, fetchedWeather);
}

async function fetchWeather(ctx: LogContext, config: BaseConfig): ServerPromise<FetchedWeather> {

	// Make our initial request to get our API URL from the latitude and longitude
	const { latitude, longitude } = constant;
	const { referenceTime } = config;

	// Maximum precision is 4 decimal points.
	const fixedLatitude = parseFloat(latitude.toFixed(4));
	const fixedLongitude = parseFloat(longitude.toFixed(4));

	const apiKey = settings.KEY_OPEN_WEATHER;
	if (!apiKey) {
		return serverErrors.internal.service(ctx, 'Weather', {
			hiddenArea: 'Weather fetch - missing API key'
		});
	}

	// Don't include API key in log statement, just in case.
	const url = `${openWeatherDataUrl}&lat=${fixedLatitude}&lon=${fixedLongitude}&appid=${apiKey}`;

	const response = await makeRequest<OpenWeatherResponse>(ctx, 'OpenWeather - fetch', url);
	if (isServerError(response)) {
		return response;
	}
	ctx.logger.info('OpenWeather', { url, response });

	if (response.cod) {
		// Likely an error.
		return serverErrors.internal.service(ctx, 'Weather', {
			hiddenArea: 'Weather fetch - error in response',
			hiddenLog: { cod: response.cod, message: response.message }
		});
	}

	// Per documentation - all times are Unix seconds UTC.
	const zoneOptions: DateTimeOptions = { zone: constant.timeZoneLabel };

	// Get moonrise and moonset as an array of events in order
	const lunar: Astro.BodyEvent[] = [];
	response.daily.forEach((daily) => {
		const rise: Astro.BodyEvent = {
			time: DateTime.fromSeconds(daily.moonrise, zoneOptions),
			isRise: true
		};
		const set: Astro.BodyEvent = {
			time: DateTime.fromSeconds(daily.moonset, zoneOptions),
			isRise: false
		};
		const both = [rise, set];
		both.sort((a, b) => {
			return a.time.toMillis() - b.time.toMillis();
		});
		lunar.push(...both);
	});

	const hourly = response.hourly.map<Weather.Hourly>((hourly) => {
		const withoutIndicator: WithoutIndicator<Weather.Hourly> = {
			...applyCommonPrecision({
				time: DateTime.fromSeconds(hourly.dt, zoneOptions).startOf('hour'),
				temp: hourly.temp,
				tempFeelsLike: hourly.feels_like,
				wind: hourly.wind_speed,
				windDirection: degreesToDirection(hourly.wind_deg),
				pressure: pressureToMillibars(hourly.pressure),
				cloudCover: toPercent(hourly.clouds),
				visibility: visibilityToMiles(hourly.visibility),
				dewPoint: hourly.dew_point,
				status: getStatusType(ctx, hourly.weather),
				humidity: toPercent(hourly.humidity),
				uvi: hourly.uvi,
				pop: hourly.pop,
			}),
		};

		return {
			...withoutIndicator,
			indicator: getIndicator(withoutIndicator)
		};
	});

	// Get the hourly entry that most closely corresponds to what our current entry will be.
	let hourForCurrent: Weather.Hourly = null!;
	for (let i = 0; i < hourly.length; i++) {
		const hour = hourly[i];
		if (referenceTime.diff(hour.time, 'minutes').minutes <= 61) {
			if (!hourForCurrent || hour.time > hourForCurrent.time) {
				hourForCurrent = hour;
			}
		}
	}

	const currentWithoutIndicator = applyCommonPrecision({
		time: DateTime.fromSeconds(response.current.dt, zoneOptions),
		temp: response.current.temp,
		tempFeelsLike: response.current.feels_like,
		wind: response.current.wind_speed,
		windDirection: degreesToDirection(response.current.wind_deg),
		pressure: pressureToMillibars(response.current.pressure),
		cloudCover: toPercent(response.current.clouds),
		visibility: visibilityToMiles(response.current.visibility),
		dewPoint: response.current.dew_point,
		status: getStatusType(ctx, response.current.weather),
		humidity: toPercent(response.current.humidity),
		uvi: response.current.uvi,
		pop: hourForCurrent.pop
	});

	return {
		current: {
			...currentWithoutIndicator,
			indicator: getIndicator(currentWithoutIndicator)
		},
		hourly,
		daily: response.daily.map<Weather.Day>((daily) => {
			const withoutIndicator: WithoutIndicator<Weather.Day> = {
				time: DateTime.fromSeconds(daily.dt, zoneOptions).startOf('day'),
				minTemp: daily.temp.min,
				maxTemp: daily.temp.max,
				status: getStatusType(ctx, daily.weather),
				pop: daily.pop
			};
			return {
				...withoutIndicator,
				indicator: getIndicator(withoutIndicator)
			};
		}),
		moonPhaseDaily: response.daily.map<Astro.MoonPhaseDay>((daily) => {
			return {
				time: DateTime.fromSeconds(daily.dt, zoneOptions).startOf('day'),
				moon: getMoonPhase(daily.moon_phase)
			};
		}),
		lunar
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
		/** Unix time, UTC, seconds */
		sunrise: number;
		/** Unix time, UTC, seconds */
		sunset: number;
		/** Temperature, F, two digits past decimal */
		temp: number;
		/** Temperature, F, two digits past decimal */
		feels_like: number;
		/** Atmospheric pressure at sea level, hPa */
		pressure: number;
		/** Humidity, [0,100] percent */
		humidity: number;
		/** Dew point, F, two digits past decimal */
		dew_point: number;
		/** Cloudiness, [0,100] percent */
		clouds: number;
		/** UV Index (usually 1-11, maybe higher) */
		uvi: number;
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
	/** Humidity, [0,100] percent */
	humidity: number;
	/** Dew point, F, two digits past decimal */
	dew_point: number;
	/** UV Index (usually 1-11, maybe higher) */
	uvi: number;
	/** Visibility in meters */
	visibility: number;
	/** Cloudiness, [0,100] percent */
	clouds: number;
	/** Wind speed in mph, two digits past decimal */
	wind_speed: number;
	/** Wind direction in degrees (direction coming from - 0 is coming from north) */
	wind_deg: number;
	/** Probability of precipitation, [0, 1] */
	pop: number;
	weather: OpenWeatherWeatherStatus[];
}

interface OpenWeatherDailyEntry {
	/** Unix time, UTC, seconds */
	dt: number;
	/** Unix time, UTC, seconds */
	sunrise: number;
	/** Unix time, UTC, seconds */
	sunset: number;
	/** Unix time, UTC, seconds */
	moonrise: number;
	/** Unix time, UTC, seconds */
	moonset: number;
	/**
	 * Moon phase. 0 and 1 are 'new moon', 0.25 is 'first quarter moon',
	 * 0.5 is 'full moon' and 0.75 is 'last quarter moon'.
	 * The periods in between are called 'waxing crescent',
	 * 'waxing gibbous', 'waning gibbous', and 'waning crescent', respectively.
	 **/
	moon_phase: number;
	temp: {
		morn: number; // Morning temp
		day: number; // Day temp
		eve: number; // Evening temp
		night: number; // Night temp
		min: number;
		max: number;
	};
	feels_like: {
		morn: number; // Morning temp
		day: number; // Day temp
		eve: number; // Evening temp
		night: number; // Night temp
	};
	/** Atmospheric pressure at sea level, hPa */
	pressure: number;
	/** Humidity, [0,100] percent */
	humidity: number;
	/** Dew point, F, two digits past decimal */
	dew_point: number;
	/** UV Index (usually 1-11, maybe higher) */
	uvi: number;
	/** Cloudiness, [0,100] percent */
	clouds: number;
	/** Wind speed in mph, two digits past decimal */
	wind_speed: number;
	/** Wind direction in degrees (direction coming from - 0 is coming from north) */
	wind_deg: number;
	/** Probability of precipitation, [0, 1] */
	pop: number;
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

/** Converts a value in [0, 100] to a value in [0, 1]. */
function toPercent(value: number) {
	// 3 digits precision to create 1 digit precision as a %.
	return toPrecision(value / 100, 3);
};

/** Converts angle degrees to cardinal directions. */
function degreesToDirection(value: number): Weather.WindDirection {
	// We are presuming that 0 degrees is N.
	// 90 degrees is N to E, 45 is N to NE, 22.5 is N to NNE, 11.5 is to halfway between N and NNE.
	// Use that logic to convert from number [0, 360] to direction.

	let directionValue = Math.floor((value + 11.25) / 22.5);
	if (directionValue === 16) {
		directionValue = 0;
	}
	return directionValue as Weather.WindDirection;
};

/** Max value for visibility from OpenWeather is 10km. */
const maxVisibility = 10000;
/** Converts meters to miles, or sets visibility to null if it is at the max. */
function visibilityToMiles(value: number): number | null {
	if (value >= maxVisibility) {
		return null;
	}
	return toPrecision(value * 0.0006213, 1);
};

/** Converts hPa (100 Pa) to mb (100 Pa). */
function pressureToMillibars(value: number) {
	return toPrecision(value, 1);
};

function applyCommonPrecision(entry: WithoutIndicator<Weather.CommonCurrentHourly>): WithoutIndicator<Weather.CommonCurrentHourly> {
	return {
		time: entry.time,
		temp: toPrecision(entry.temp, 1),
		tempFeelsLike: toPrecision(entry.tempFeelsLike, 1),
		wind: toPrecision(entry.wind, 1),
		windDirection: entry.windDirection,
		pressure: toPrecision(entry.pressure, 1),
		cloudCover: toPrecision(entry.cloudCover, 3), // .xxx becomes xx.x%, so use 3 digits
		visibility: entry.visibility ? toPrecision(entry.visibility, 1) : null,
		dewPoint: toPrecision(entry.dewPoint, 1),
		status: entry.status,
		uvi: toPrecision(entry.uvi, 1),
		humidity: toPrecision(entry.humidity, 3), // .xxx becomes xx.x%, so use 3 digits
		pop: toPrecision(entry.pop, 3), // .xxx becomes xx.x%, so use 3 digits
	};
}

function toPrecision(value: number, precision: number): number {
	return parseFloat(value.toFixed(precision));
}

function getStatusType(ctx: LogContext, statuses: OpenWeatherWeatherStatus[]): StatusType {
	const logger = ctx.logger;

	if (!statuses.length) {
		logger.warn('No weather statuses provided');
	}
	const statusNumbers = statuses.map((status) => {
		return status.id;
	});
	if (statusNumbers.length > 1 || statusNumbers[0] === 0) {
		logger.warn('Multiple weather statuses provided', { statusNumbers });
	}
	let statusNumber = statusNumbers[0];

	const status = openWeatherStatusMap[statusNumber as keyof typeof openWeatherStatusMap] || StatusType.unknown;
	if (status === StatusType.unknown) {
		logger.warn('Weather status is unknown due to mismatch of ID', { id: statusNumber });
	}
	return status;
}

function getMoonPhase(value: number): Astro.MoonPhase {
	/*
		As described in documentation: 0 and 1 are new; everything else is separated by 12.5.
		Values may be any value, so we will need to round.
	*/
	let asPhase = Math.round(value * 8); // Get to [0, 8]
	if (asPhase === 8) {
		asPhase = 0;
	}
	return asPhase as Astro.MoonPhase;
}

// Retrieved from https://openweathermap.org/weather-conditions#Weather-Condition-Codes-2
const openWeatherStatusMap = {
	// Thunderstorm
	200: StatusType.thun_light,
	201: StatusType.thun_medium,
	202: StatusType.thun_heavy,
	210: StatusType.thun_light,
	211: StatusType.thun_medium,
	212: StatusType.thun_heavy,
	221: StatusType.thun_medium,
	230: StatusType.thun_light,
	231: StatusType.thun_medium,
	232: StatusType.thun_heavy,

	// Drizzle
	300: StatusType.rain_drizzle,
	301: StatusType.rain_drizzle,
	302: StatusType.rain_drizzle,
	310: StatusType.rain_drizzle,
	311: StatusType.rain_drizzle,
	312: StatusType.rain_drizzle,
	313: StatusType.rain_drizzle,
	314: StatusType.rain_drizzle,
	321: StatusType.rain_drizzle,

	// Rain
	500: StatusType.rain_light,
	501: StatusType.rain_medium,
	502: StatusType.rain_heavy,
	503: StatusType.rain_heavy,
	504: StatusType.rain_heavy,
	511: StatusType.rain_freeze,
	520: StatusType.rain_light,
	521: StatusType.rain_medium,
	522: StatusType.rain_heavy,
	531: StatusType.rain_medium,

	// Snow
	600: StatusType.snow_light,
	601: StatusType.snow_medium,
	602: StatusType.snow_heavy,
	611: StatusType.snow_sleet,
	612: StatusType.snow_sleet,
	613: StatusType.snow_sleet,
	615: StatusType.snow_rain,
	616: StatusType.snow_rain,
	620: StatusType.snow_rain,
	621: StatusType.snow_rain,
	622: StatusType.snow_rain,

	// Atmosphere
	701: StatusType.fog,
	711: StatusType.smoke,
	721: StatusType.haze,
	731: StatusType.dust,
	741: StatusType.fog,
	751: StatusType.dust,
	761: StatusType.dust,
	762: StatusType.dust,
	771: StatusType.intense_other,
	781: StatusType.intense_storm,

	// Clear
	800: StatusType.clear,

	// Clouds
	801: StatusType.clouds_few,
	802: StatusType.clouds_some,
	803: StatusType.clouds_most,
	804: StatusType.clouds_over
};