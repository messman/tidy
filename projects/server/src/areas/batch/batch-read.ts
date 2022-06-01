import * as iso from '@wbtdevlocal/iso';
import { ServerPromise } from '../../api/error';
import { AstroContent, createAstroContent, readAstroContent } from '../../services/astro/astro-content';
import { LogContext } from '../../services/logging/pino';
import { TestSeed } from '../../services/test/randomize';
import { createTideContent, readTideContent, TideContent } from '../../services/tide/tide-content';
import { dateForZone } from '../../services/time';
import { ForDay } from '../../services/types';
import { createWeatherContent, readWeatherContent, WeatherContent } from '../../services/weather/weather-content';
import { BatchConfig, createWellsConfig } from './context';

/** The main function. Calls APIs. */
export async function readBatch(ctx: LogContext): ServerPromise<iso.Batch.BatchContent> {

	const config = createWellsConfig();

	const tideContent = await readTideContent(ctx, config);
	if (iso.isServerError(tideContent)) {
		return tideContent;
	}

	// Astro has no server errors.
	const astroContent = await readAstroContent(ctx, config);

	const weatherContent = await readWeatherContent(ctx, config);
	if (iso.isServerError(weatherContent)) {
		return weatherContent;
	}

	return createBatchContent(ctx, config, tideContent, astroContent, weatherContent);
}

/** The main test function. */
export async function readBatchWithSeed(ctx: LogContext, seed: TestSeed): Promise<iso.Batch.BatchContent> {
	const config = createWellsConfig();

	const tideContent = createTideContent(ctx, config, seed);
	const astroContent = createAstroContent(ctx, config, seed);
	const weatherContent = createWeatherContent(ctx, config, seed);

	return createBatchContent(ctx, config, tideContent, astroContent, weatherContent);
}

function createBatchContent(_ctx: LogContext, config: BatchConfig, tides: TideContent, astro: AstroContent, weather: WeatherContent): iso.Batch.BatchContent {
	const meta: iso.Batch.Meta = {
		referenceTime: config.base.live.referenceTimeInZone,
		processingTime: dateForZone(new Date(), config.base.input.timeZoneLabel),
		tideHeightPrecision: config.tide.input.tideHeightPrecision,
		timeZone: config.base.input.timeZoneLabel
	};

	return {
		meta,
		current: {
			sun: {
				previous: astro.previousEvent,
				next: astro.nextEvent
			},
			weather: weather.currentWeather,
			tides: tides.currentTides
		},
		predictions: {
			cutoffDate: config.base.live.maxShortTermDataFetch,
			sun: astro.shortTermEvents,
			weather: weather.shortTermWeather,
			tides: tides.shortTermTides
		},
		daily: {
			cutoffDate: config.base.live.maxLongTermDataFetch,
			tideExtremes: tides.longTermTideExtremes,
			days: mergeForLongTerm(config, tides.longTermTides, astro.longTermEvents, weather.longTermWeather)
		}
	};
}

/** Merges different API areas for long-term data (daily weather, tides, etc). */
function mergeForLongTerm(config: BatchConfig, tides: ForDay<iso.Tide.TideEventRange>[], sunEvents: ForDay<iso.Astro.SunEvent[]>[], weatherEvents: iso.Weather.DailyWeather[]): iso.Batch.DailyDay[] {

	const referenceDay = config.base.live.referenceTimeInZone.startOf('day');
	const dayMap: Map<number, iso.Batch.DailyDay> = new Map();

	tides.forEach((t) => {
		const day = referenceDay.plus({ days: t.day });
		dayMap.set(t.day, {
			date: day,
			sun: null!,
			weather: null!,
			tides: t.entity
		});
	});
	sunEvents.forEach((s) => {
		const record = dayMap.get(s.day);
		if (record) {
			record.sun = s.entity;
		}
	});
	weatherEvents.forEach((w) => {
		const day = w.day.startOf('day').diff(referenceDay, 'days').days;
		const record = dayMap.get(day);
		if (record) {
			record.weather = w;
		}
	});

	return Array.from(dayMap.values());
}