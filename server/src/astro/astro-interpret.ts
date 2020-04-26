import { SunEvent } from 'tidy-shared';
import { APIConfigurationContext } from '../all/context';
import { ForDay } from '../all/all';
import { AllIssue } from '../all/all-merge';
import { IntermediateAstroValues } from './astro-intermediate';

export interface InterpretedAstro extends AllIssue {
	previousEvent: SunEvent,
	nextEvent: SunEvent,
	shortTermEvents: SunEvent[],
	longTermEvents: ForDay<SunEvent[]>[],
}

// Assumption made: we will always get sun events in pairs - sunrise and sunset - for each day.

export function interpretAstro(configurationContext: APIConfigurationContext, intermediateAstro: IntermediateAstroValues): InterpretedAstro {

	if (intermediateAstro.errors) {
		return {
			errors: intermediateAstro.errors,
			warnings: intermediateAstro.warnings,
			previousEvent: null!,
			nextEvent: null!,
			shortTermEvents: null!,
			longTermEvents: null!
		}
	}

	const referenceTime = configurationContext.context.referenceTimeInZone;
	const referenceDay = referenceTime.startOf('day');
	const shortTermLimit = configurationContext.context.maxShortTermDataFetch;
	const longTermLimit = configurationContext.context.maxLongTermDataFetch;

	let previousEvent: SunEvent = null!;
	let nextEvent: SunEvent = null!;
	const shortTermEvents: SunEvent[] = [];
	const longTermEvents: ForDay<SunEvent[]>[] = [];
	let currentDayLongTermEvents: SunEvent[] = [];

	intermediateAstro.sunEvents.forEach((s) => {
		const eventTime = configurationContext.action.parseDateForZone(s.time);
		if (eventTime < referenceTime) {
			previousEvent = s;
		}
		if (!nextEvent && eventTime > referenceTime) {
			nextEvent = s;
		}

		// Short and long term will include the sunrise and sunset of the reference day.

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
		errors: null,
		warnings: intermediateAstro.warnings,
		previousEvent: previousEvent,
		nextEvent: nextEvent,
		shortTermEvents: shortTermEvents,
		longTermEvents: longTermEvents
	};
}