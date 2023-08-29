import { DateTime } from 'luxon';
import { Batch, BatchMeta, BatchNowWeatherHourly, isServerError } from '@wbtdevlocal/iso';
import { ServerPromise } from '../../api/error';
import { computeAstro } from '../../services/astro/astro-compute';
import { createAstro } from '../../services/astro/astro-compute-create';
import { AstroFetched, getAstroAdditionalContext } from '../../services/astro/astro-shared';
import { BaseConfig, BaseInput, createBaseLiveConfig } from '../../services/config';
import { LogContext } from '../../services/logging/pino';
import { combineSeed, randomizer, TestSeed } from '../../services/test/randomize';
import { fetchTides } from '../../services/tide/tide-fetch';
import { createTides } from '../../services/tide/tide-fetch-create';
import { getTideAdditionalContext, TideFetched } from '../../services/tide/tide-shared';
import { dateForZone } from '../../services/time';
import { readWeather } from '../../services/weather/weather-fetch';
import { createWeather } from '../../services/weather/weather-fetch-create';
import { getWeatherAdditionalContext, WeatherFetched } from '../../services/weather/weather-shared';
import { getBeachTimeDays } from './beach';

/** The main function. Calls APIs. */
export async function readBatch(ctx: LogContext): ServerPromise<Batch> {
	const config = createConfig(dateForZone(new Date()));

	const fetchedTide = await fetchTides(ctx, config);
	if (isServerError(fetchedTide)) {
		return fetchedTide;
	}

	// Astro has no server errors or promise.
	const computedAstro = computeAstro(ctx, config);

	const fetchedWeather = await readWeather(ctx, config);
	if (isServerError(fetchedWeather)) {
		return fetchedWeather;
	}

	return createBatchContent(ctx, config, fetchedTide, computedAstro, fetchedWeather);
}

/** The main test function. */
export async function readBatchWithSeed(ctx: LogContext, seed: TestSeed): Promise<Batch> {
	const timeRandomizer = randomizer(combineSeed('_time_', seed));
	// From the start of the day, go to between 7AM and 9PM (better probability of nice daytime results).
	const minutesAhead = timeRandomizer.randomInt(60 * 7, 60 * 21, true);
	const date = dateForZone(new Date()).startOf('day').plus({ minutes: minutesAhead });
	const config = createConfig(date);

	const fetchedTide = createTides(config, seed);
	const computedAstro = createAstro(config, seed);
	const fetchedWeather = createWeather(config, seed);

	return createBatchContent(ctx, config, fetchedTide, computedAstro, fetchedWeather);
}

function createConfig(referenceTime: DateTime): BaseConfig {
	const input: BaseInput = {
		referenceTime,
		futureDays: 7
	};
	const live = createBaseLiveConfig(input);
	return {
		...live,
		input
	};
}

function createBatchContent(_ctx: LogContext, config: BaseConfig, tideFetched: TideFetched, astroFetched: AstroFetched, weatherFetched: WeatherFetched): Batch {
	const meta: BatchMeta = {
		referenceTime: config.referenceTime,
		processingTime: dateForZone(new Date()),
	};

	const tideAdditional = getTideAdditionalContext(config, tideFetched);
	const { range, currentPoint, currentId, nextId, previousId } = tideAdditional;
	const astroAdditional = getAstroAdditionalContext(config, astroFetched, weatherFetched.moonPhaseDaily);
	const { sunRelativity, sunCloseDays, todayAstroDay, solarEventMap, days: astroDays } = astroAdditional;
	const { filteredHourly, isCurrentDaytime, indicatorChangeHourlyId, tempRange } = getWeatherAdditionalContext(config, weatherFetched, solarEventMap, astroDays);

	return {
		meta,
		tideExtrema: {
			extrema: tideFetched.extrema,
			minId: range.min.id,
			maxId: range.max.id
		},
		solarEvents: astroFetched.solarEvents,
		now: {
			astro: {
				sun: {
					previousId: sunRelativity.previousId,
					currentId: sunRelativity.currentId,
					nextRiseSetId: sunRelativity.nextRiseSetId,
					nextRiseSetTwilightId: sunRelativity.nextRiseSetTwilightId,
					yesterday: sunCloseDays.yesterday,
					today: sunCloseDays.today,
					tomorrow: sunCloseDays.tomorrow,
				},
				moon: {
					phase: todayAstroDay.moon
				},
			},
			tide: {
				current: currentPoint,
				currentId,
				nextId,
				previousId
			},
			weather: {
				current: {
					...weatherFetched.current,
					isDaytime: isCurrentDaytime
				},
				hourly: filteredHourly.map<BatchNowWeatherHourly>((hourly) => {
					return { ...hourly.point, isDaytime: hourly.isDaytime };
				}),
				indicatorChangeHourlyId
			}
		},
		week: {
			days: getBeachTimeDays(config, tideFetched, tideAdditional, astroFetched, astroAdditional, weatherFetched),
			tempRange,
		},
		// beach: getBeachContent(config, tide, currentPoint, dailyTides, astro, weather),
		// tide: {
		// 	measured,
		// 	relativity,
		// 	daily: dailyTides,
		// 	dailyMin,
		// 	dailyMax
		// },
		// astro: {
		// 	sun: {
		// 		relativity: getSunRelativity(config, astro),
		// 		yesterday: sunYesterday,
		// 		today: sunToday,
		// 		tomorrow: sunTomorrow
		// 	},
		// 	moon: {
		// 		next: weather.lunar[0],
		// 		nextLunarDay: getNextLunarDay(weather),
		// 	}
		// },

	};
}