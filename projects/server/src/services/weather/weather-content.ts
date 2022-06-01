import * as iso from '@wbtdevlocal/iso';
import { ServerPromise } from '../../api/error';
import { LogContext } from '../logging/pino';
import { TestSeed } from '../test/randomize';
import { createTimeIterator } from './iterator';
import { WeatherConfig } from './weather-config';
import { FetchedWeather, fetchWeather } from './weather-fetch';
import { createFetchedWeather } from './weather-fetch-create';

export interface WeatherContent {
	currentWeather: iso.Weather.WeatherStatus;
	shortTermWeather: iso.Weather.WeatherStatus[];
	longTermWeather: iso.Weather.DailyWeather[];
}

export async function readWeatherContent(ctx: LogContext, config: WeatherConfig): ServerPromise<WeatherContent> {
	const fetchedWeather = await fetchWeather(ctx, config);
	if (iso.isServerError(fetchedWeather)) {
		return fetchedWeather;
	}
	return createContent(config, fetchedWeather);
}

export function createWeatherContent(_ctx: LogContext, config: WeatherConfig, seed: TestSeed): WeatherContent {
	const computed = createFetchedWeather(config, seed);
	return createContent(config, computed);
}

function createContent(config: WeatherConfig, fetchedWeather: FetchedWeather): WeatherContent {

	const current = fetchedWeather.currentWeather;
	const currentWeatherStatus: iso.Weather.WeatherStatus = {
		time: current.time,
		temp: current.temp,
		tempFeelsLike: current.tempFeelsLike,
		wind: current.wind,
		windDirection: current.windDirection,
		visibility: current.visibility,
		cloudCover: current.cloudCover,
		dewPoint: current.dewPoint,
		pressure: current.pressure,
		status: current.status
	};

	const referenceTime = config.base.live.referenceTimeInZone;
	const hoursGapBetweenWeatherData = config.weather.input.hoursGapBetweenWeatherData;
	const shortTermLimit = config.base.live.maxShortTermDataFetch;

	const iterableHourlyData = fetchedWeather.shortTermWeather.map((shortTerm, i) => {
		const next = fetchedWeather.shortTermWeather[i + 1];
		const nextTime = next?.time || shortTerm.time.plus({ hours: 1 });

		// We aren't doing real measurements right now, so just do fake ones.
		const value: iso.Weather.WeatherStatus = {
			time: shortTerm.time,
			temp: shortTerm.temp,
			tempFeelsLike: shortTerm.tempFeelsLike,
			wind: shortTerm.wind,
			windDirection: shortTerm.windDirection,
			dewPoint: shortTerm.dewPoint,
			visibility: shortTerm.visibility,
			cloudCover: shortTerm.cloudCover,
			pressure: shortTerm.pressure,
			status: shortTerm.status
		};

		return {
			span: {
				begin: shortTerm.time,
				end: nextTime
			},
			value: value
		};
	});
	const shortTermIterator = createTimeIterator(iterableHourlyData);

	const currentHour = referenceTime.startOf("hour");
	// Hourly weather comes from the closest even hour (moving forward).
	// Note - this means we may skip forward into the next day.
	let startHour = currentHour;
	if (startHour.hour % 2 === 1) {
		startHour = startHour.plus({ hours: 1 });
	}
	// Get the hours between our start hour and our short-term limit
	const shortHoursBetween = shortTermLimit.diff(startHour, "hours").hours;
	const nShortTermIterations = Math.ceil(shortHoursBetween / hoursGapBetweenWeatherData);

	const shortTermWeather: iso.Weather.WeatherStatus[] = [];

	for (let i = 0; i < nShortTermIterations; i++) {
		const dateTime = startHour.plus({ hours: i * hoursGapBetweenWeatherData });
		const next = shortTermIterator.next(dateTime);
		if (!next) {
			break;
		}
		shortTermWeather.push(next);
	}

	const longTermLimit = config.base.live.maxLongTermDataFetch;
	const longTermWeather: iso.Weather.DailyWeather[] = fetchedWeather.longTermWeather.filter((longTerm) => {
		return longTerm.day >= referenceTime.startOf('day') && longTerm.day <= longTermLimit;
	});

	return {
		currentWeather: currentWeatherStatus,
		shortTermWeather: shortTermWeather,
		longTermWeather: longTermWeather
	};
}

