import * as iso from '@wbtdevlocal/iso';
import { ServerPromise } from '../../api/error';
import { computeAstro } from '../../services/astro/astro-compute';
import { createAstro } from '../../services/astro/astro-compute-create';
import { ComputedAstro, getCloseSunDays, getNextLunarDay, getSunRelativity } from '../../services/astro/astro-shared';
import { BaseConfig, BaseInput, createBaseLiveConfig } from '../../services/config';
import { LogContext } from '../../services/logging/pino';
import { TestSeed } from '../../services/test/randomize';
import { readTides } from '../../services/tide/tide-fetch';
import { createTides } from '../../services/tide/tide-fetch-create';
import { FetchedTide, getTideMeasuredAndRelativity, getTideMinMax } from '../../services/tide/tide-shared';
import { dateForZone } from '../../services/time';
import { readWeather } from '../../services/weather/weather-fetch';
import { createWeather } from '../../services/weather/weather-fetch-create';
import { FetchedWeather, filterHourlyWeather } from '../../services/weather/weather-shared';
import { getBeachContent, getTideDays } from './beach';

/** The main function. Calls APIs. */
export async function readBatch(ctx: LogContext): ServerPromise<iso.Batch.BatchContent> {
	const config = createConfig();

	const fetchedTide = await readTides(ctx, config);
	if (iso.isServerError(fetchedTide)) {
		return fetchedTide;
	}

	// Astro has no server errors or promise.
	const computedAstro = computeAstro(ctx, config);

	const fetchedWeather = await readWeather(ctx, config);
	if (iso.isServerError(fetchedWeather)) {
		return fetchedWeather;
	}

	return createBatchContent(ctx, config, fetchedTide, computedAstro, fetchedWeather);
}

/** The main test function. */
export async function readBatchWithSeed(ctx: LogContext, seed: TestSeed): Promise<iso.Batch.BatchContent> {
	const config = createConfig();

	const fetchedTide = createTides(config, seed);
	const computedAstro = createAstro(config, seed);
	const fetchedWeather = createWeather(config, seed);

	return createBatchContent(ctx, config, fetchedTide, computedAstro, fetchedWeather);
}

function createConfig(): BaseConfig {
	const input: BaseInput = {
		referenceTime: new Date(),
		futureDays: 7
	};
	const live = createBaseLiveConfig(input);
	return {
		...live,
		input
	};
}

function createBatchContent(_ctx: LogContext, config: BaseConfig, tide: FetchedTide, astro: ComputedAstro, weather: FetchedWeather): iso.Batch.BatchContent {
	const meta: iso.Batch.Meta = {
		referenceTime: config.referenceTime,
		processingTime: dateForZone(new Date(), iso.constant.timeZoneLabel),
	};

	const [dailyMin, dailyMax] = getTideMinMax(tide.extrema);
	const { measured, relativity } = getTideMeasuredAndRelativity(config, tide);

	const [sunYesterday, sunToday, sunTomorrow] = getCloseSunDays(config, astro);

	return {
		meta,
		beach: getBeachContent(config, tide, astro, weather),
		tide: {
			measured,
			relativity,
			daily: getTideDays(weather, tide.extrema),
			dailyMin,
			dailyMax
		},
		astro: {
			sun: {
				relativity: getSunRelativity(config, astro),
				yesterday: sunYesterday,
				today: sunToday,
				tomorrow: sunTomorrow
			},
			moon: {
				next: weather.lunar[0],
				nextLunarDay: getNextLunarDay(weather),
			}
		},
		weather: {
			current: appendDaytimeToCurrentWeather(astro, weather.current),
			hourly: prepareHourlyWeather(config, astro, weather.hourly)
		}
	};
}

function appendDaytimeToCurrentWeather(astro: ComputedAstro, current: iso.Weather.Current): iso.Batch.WeatherContentCurrent {
	const day = astro.daily.find((day) => {
		return current.time.hasSame(day.rise, 'day');
	})!;
	const isDaytime = current.time > day.rise && current.time < day.set;
	return {
		...current,
		isDaytime
	};
}

/**
 * Does two things:
 * - Filters the hourly down to fewer hours total
 * - Figures out if it's daytime at each hour
*/
function prepareHourlyWeather(config: BaseConfig, astro: ComputedAstro, hourly: iso.Weather.Hourly[]): iso.Batch.WeatherContentHourly[] {
	hourly = hourly.filter((entry) => {
		return filterHourlyWeather(config, entry);
	});

	let sunDayIndex = 0;
	let sunDay = astro.daily[sunDayIndex];
	return hourly.map<iso.Batch.WeatherContentHourly>((hourly) => {
		// Assume that if it's not today, it's tomorrow.
		if (!hourly.time.hasSame(sunDay.rise, 'day')) {
			sunDayIndex++;
			sunDay = astro.daily[sunDayIndex];
		}

		const isDaytime = hourly.time > sunDay.rise && hourly.time < sunDay.set;

		return {
			...hourly,
			isDaytime
		};
	});
}