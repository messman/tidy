import { DateTime } from 'luxon';
import { AllCurrentTides, TideEvent, TideEventRange, TideExtremes, TideStatus } from '@wbtdevlocal/iso';
import { ForDay } from '../all/all';
import { AllIssue } from '../all/all-merge';
import { APIConfigurationContext } from '../all/context';
import { IntermediateTideValues } from './tide-intermediate';

export interface InterpretedTides extends AllIssue {
	currentTides: AllCurrentTides,
	shortTermTides: TideEventRange,
	longTermTideExtremes: TideExtremes,
	longTermTides: ForDay<TideEventRange>[];
}

export function interpretTides(configurationContext: APIConfigurationContext, intermediateTides: IntermediateTideValues): InterpretedTides {

	if (intermediateTides.errors) {
		return {
			errors: intermediateTides.errors,
			warnings: intermediateTides.warnings,
			currentTides: null!,
			shortTermTides: null!,
			longTermTideExtremes: null!,
			longTermTides: null!
		};
	}

	const { pastEvents, current, futureEvents } = intermediateTides;

	const currentTides = interpretCurrent(pastEvents, current, futureEvents);
	const shortTermTides = interpretShortTerm(configurationContext, pastEvents, futureEvents);
	const [longTermTideExtremes, longTermTides] = interpretLongTerm(configurationContext, pastEvents, futureEvents);

	return {
		errors: null,
		warnings: intermediateTides.warnings,
		currentTides: currentTides,
		shortTermTides: shortTermTides,
		longTermTideExtremes: longTermTideExtremes,
		longTermTides: longTermTides
	};
}

function interpretCurrent(pastEvents: TideEvent[], current: TideStatus, futureEvents: TideEvent[]): AllCurrentTides {
	// Get the previous and next tide relative to the reference time.
	const previousTide = pastEvents[pastEvents.length - 1];
	const outsidePreviousTide = pastEvents[pastEvents.length - 2];
	const nextTide = futureEvents[0];
	const outsideNextTide = futureEvents[1];

	const events = [previousTide, nextTide];
	const [minEvent, maxEvent] = getMinMaxEvents(events);

	return {
		height: current.height,
		range: {
			events: events,
			lowest: minEvent,
			highest: maxEvent,
			outsidePrevious: [outsidePreviousTide],
			outsideNext: [outsideNextTide]
		}
	};

}

function interpretShortTerm(configurationContext: APIConfigurationContext, pastEvents: TideEvent[], futureEvents: TideEvent[]): TideEventRange {

	/*
		Special case: usually this is a TideEventRange with only one previous and one next outside of range.
		But here we include more in an array of previous and next, to handle additional scenarios (like how you might want to show X hours
		of tides before the reference time and need that space).
		We should be good to go back at least one full day per configuration.
	*/
	// TODO - this is arbitrary, make it part of the config.
	const outsideEventsLimit = 2;

	// Get the "predictions", a.k.a. the short-term tides information.
	const shortTermLimitDate = configurationContext.context.maxShortTermDataFetch;

	// Go *a few* past so it looks continuous.
	let outsideNextEventIndex: number = -1;
	const shortTermEvents = futureEvents.filter(function (t, i) {
		if (t.time <= shortTermLimitDate) {
			return true;
		}
		if (outsideNextEventIndex < 0) {
			outsideNextEventIndex = i;
		}
		return false;
	});
	let outsideNextEvents: TideEvent[] = [];
	if (outsideNextEventIndex >= 0) {
		outsideNextEvents = futureEvents.slice(outsideNextEventIndex, Math.min(outsideNextEventIndex + outsideEventsLimit, futureEvents.length - 1));
	}

	const [minEvent, maxEvent] = getMinMaxEvents(shortTermEvents);

	return {
		lowest: minEvent,
		highest: maxEvent,
		events: shortTermEvents,
		outsidePrevious: pastEvents.slice(-outsideEventsLimit),
		outsideNext: outsideNextEvents
	};
}

function interpretLongTerm(configurationContext: APIConfigurationContext, pastEvents: TideEvent[], futureEvents: TideEvent[]): [TideExtremes, ForDay<TideEventRange>[]] {

	// Day matters in this section, so we use Luxon (for time zones).


	const allEvents = [...pastEvents, ...futureEvents];
	const eventsByDay: TideEvent[][] = [];
	let currentEventsOfDay: TideEvent[] = [];
	let previousEventDateTime: DateTime;

	allEvents.forEach((t) => {
		// Tide events are already in the time zone we care about.
		if (previousEventDateTime && previousEventDateTime.hasSame(t.time, 'day')) {
			currentEventsOfDay.push(t);
		}
		else {
			previousEventDateTime = t.time;
			currentEventsOfDay = [t];
			eventsByDay.push(currentEventsOfDay);
		}
	});

	const longTermEventRanges: ForDay<TideEventRange>[] = [];

	const longTermLimitDay = configurationContext.context.maxLongTermDataFetch;
	const referenceDay = configurationContext.context.referenceTimeInZone.startOf('day');

	eventsByDay.forEach((events, index) => {
		const dayOfEvents = events[0].time.startOf('day');
		if (dayOfEvents < referenceDay) {
			// Prior to our first day. Ignore.
		}
		else if (dayOfEvents > longTermLimitDay) {
			// After our last day. Ignore.
		}
		else {

			const previousDayEvents = eventsByDay[index - 1];
			const nextDayEvents = eventsByDay[index + 1];
			if (!previousDayEvents || !nextDayEvents) {
				throw new Error('Cannot create long term tide data structure');
			}

			const [minEvent, maxEvent] = getMinMaxEvents(events);

			longTermEventRanges.push({
				day: dayOfEvents.diff(referenceDay, 'days').days,
				entity: {
					lowest: minEvent,
					highest: maxEvent,
					events: events,
					outsidePrevious: previousDayEvents.slice(-1),
					outsideNext: [nextDayEvents[0]]
				}
			});
		}
	});

	let minHeight: number = Infinity;
	let maxHeight: number = -Infinity;

	let minEvent: TideEvent = null!;
	let maxEvent: TideEvent = null!;

	longTermEventRanges.forEach(function (f) {
		const r = f.entity;
		if (r.lowest.height < minHeight) {
			minHeight = r.lowest.height;
			minEvent = r.lowest;
		}
		if (r.highest.height > maxHeight) {
			maxHeight = r.highest.height;
			maxEvent = r.highest;
		}
	});

	return [
		{
			lowest: minEvent,
			highest: maxEvent
		},
		longTermEventRanges
	];
}

function getMinMaxEvents(events: TideEvent[]): [TideEvent, TideEvent] {
	if (!events || !events.length) {
		throw new Error('Cannot get min and max of empty array');
	}
	let minHeight: number = Infinity;
	let maxHeight: number = -Infinity;

	let minEvent: TideEvent = null!;
	let maxEvent: TideEvent = null!;

	events.forEach(function (t) {
		if (t.height < minHeight) {
			minHeight = t.height;
			minEvent = t;
		}
		if (t.height > maxHeight) {
			maxHeight = t.height;
			maxEvent = t;
		}
	});

	return [minEvent, maxEvent];
};