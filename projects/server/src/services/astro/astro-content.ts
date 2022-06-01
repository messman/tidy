import * as iso from '@wbtdevlocal/iso';
import { LogContext } from '../logging/pino';
import { TestSeed } from '../test/randomize';
import { ForDay } from '../types';
import { computeAstro, ComputedAstro } from './astro-compute';
import { createComputedAstro } from './astro-compute-create';
import { AstroConfig } from './astro-config';

import SunEvent = iso.Astro.SunEvent;

export interface AstroContent {
	previousEvent: SunEvent,
	nextEvent: SunEvent,
	shortTermEvents: SunEvent[],
	longTermEvents: ForDay<SunEvent[]>[],
}

// Assumption made: we will always get sun events in pairs - sunrise and sunset - for each day.

export async function readAstroContent(ctx: LogContext, config: AstroConfig): Promise<AstroContent> {
	const computed = await computeAstro(ctx, config);
	return createContent(config, computed);
}

export function createAstroContent(_ctx: LogContext, config: AstroConfig, seed: TestSeed): AstroContent {
	const computed = createComputedAstro(config, seed);
	return createContent(config, computed);
}

function createContent(config: AstroConfig, computed: ComputedAstro): AstroContent {

	const referenceTime = config.base.live.referenceTimeInZone;
	const referenceDay = referenceTime.startOf('day');
	const shortTermLimit = config.base.live.maxShortTermDataFetch.endOf('day');
	const longTermLimit = config.base.live.maxLongTermDataFetch;

	let previousEvent: SunEvent = null!;
	let nextEvent: SunEvent = null!;
	const shortTermEvents: SunEvent[] = [];
	const longTermEvents: ForDay<SunEvent[]>[] = [];
	let currentDayLongTermEvents: SunEvent[] = [];

	computed.sunEvents.forEach((s) => {
		// Get the time in our time zone in a DateTime object.
		const eventTime = s.time;
		// Figure out if it's an event adjacent to our reference time.
		if (eventTime < referenceTime) {
			previousEvent = s;
		}
		if (!nextEvent && eventTime > referenceTime) {
			nextEvent = s;
		}

		// Short and long term will include the sunrise and sunset of the reference day itself.

		// We will have data duplication between short and long term - it's just sunrise/sunset data, so not a big deal.
		if (eventTime < shortTermLimit) {
			shortTermEvents.push(s);
		}
		if (eventTime < longTermLimit) {
			if (currentDayLongTermEvents.length === 1) {
				currentDayLongTermEvents.push(s);
				longTermEvents.push({
					day: eventTime.startOf('day').diff(referenceDay, 'days').days,
					entity: currentDayLongTermEvents
				});
				currentDayLongTermEvents = [];
			}
			else {
				currentDayLongTermEvents.push(s);
			}
		}
	});

	return {
		previousEvent: previousEvent,
		nextEvent: nextEvent,
		shortTermEvents: shortTermEvents,
		longTermEvents: longTermEvents
	};
}