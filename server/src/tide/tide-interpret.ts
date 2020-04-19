import { AllCurrentTides, TideEventRange, TideExtremes, TideStatus, TideEvent } from 'tidy-shared';
import { APIConfigurationContext } from '../context';
import { DateTime } from 'luxon';

export interface InterpretedTides {
	currentTides: AllCurrentTides,
	shortTermTides: TideEventRange,
	longTermTideExtremes: TideExtremes,
	longTermTides: TideEventRange[]
}

export function interpretTides(configurationContext: APIConfigurationContext, pastEvents: TideEvent[], current: TideStatus, futureEvents: TideEvent[]): InterpretedTides {

	const currentTides = interpretCurrent(pastEvents, current, futureEvents);
	const shortTermTides = interpretShortTerm(configurationContext, currentTides.previous, futureEvents);
	const [longTermTideExtremes, longTermTides] = interpretLongTerm(configurationContext, pastEvents, futureEvents);

	return {
		currentTides: currentTides,
		shortTermTides: shortTermTides,
		longTermTideExtremes: longTermTideExtremes,
		longTermTides: longTermTides
	};
}

function interpretCurrent(pastEvents: TideEvent[], current: TideStatus, futureEvents: TideEvent[]): AllCurrentTides {
	// Get the previous and next tide relative to the reference time.

	// OLD way - remove if needed.
	// let previousTide: TideEvent = null!;
	// let nextTide: TideEvent = null!;
	// events.some(function (t) {
	// 	if (!previousTide) {
	// 		previousTide = t;
	// 	}
	// 	if (previousTide.time < t.time && t.time < referenceTime) {
	// 		previousTide = t;
	// 	}
	// 	if (!nextTide && t.time > referenceTime) {
	// 		nextTide = t;
	// 		return true;
	// 	}
	// 	return false;
	// });

	const previousTide = pastEvents[pastEvents.length - 1];
	const nextTide = futureEvents[0];
	return {
		previous: previousTide,
		next: nextTide,
		height: current.height
	};

}

function interpretShortTerm(configurationContext: APIConfigurationContext, previousEvent: TideEvent, futureEvents: TideEvent[]): TideEventRange {

	// Get the "predictions", a.k.a. the short-term tides information.
	const shortTermLimitDate = configurationContext.context.maxShortTermDataFetch.toJSDate();

	// Go one past so it looks continuous.
	let outsideNextEvent: TideEvent | null = null;
	let shortTermEvents = futureEvents.filter(function (t) {
		if (t.time <= shortTermLimitDate) {
			return true;
		}
		else if (!outsideNextEvent) {
			outsideNextEvent = t;
			return false;
		}
		return false;
	});

	const [minEvent, maxEvent] = getMinMaxEvents(shortTermEvents);

	return {
		lowest: minEvent,
		highest: maxEvent,
		events: shortTermEvents,
		outsidePrevious: previousEvent,
		outsideNext: outsideNextEvent
	};
}

function interpretLongTerm(configurationContext: APIConfigurationContext, pastEvents: TideEvent[], futureEvents: TideEvent[]): [TideExtremes, TideEventRange[]] {

	// Day matters in this section, so we use Luxon (for time zones).


	const allEvents = [...pastEvents, ...futureEvents];
	const eventsByDay: TideEvent[][] = [];
	let currentEventsOfDay: TideEvent[] = []
	let previousEventDateTime: DateTime;

	allEvents.forEach((t) => {
		// Tide events are already in the time zone we care about.
		const eventDateTime = DateTime.fromJSDate(t.time, { zone: configurationContext.configuration.location.timeZoneLabel });
		if (previousEventDateTime && previousEventDateTime.hasSame(eventDateTime, 'day')) {
			currentEventsOfDay.push(t);
		}
		else {
			previousEventDateTime = eventDateTime;
			currentEventsOfDay = [t];
			eventsByDay.push(currentEventsOfDay);
		}
	});

	const longTermEventRanges: TideEventRange[] = [];

	const longTermLimitDay = configurationContext.context.maxLongTermDataFetch;
	const referenceDay = configurationContext.context.referenceTimeInZone.startOf('day');

	eventsByDay.forEach((events, index) => {
		const dayOfEvents = DateTime.fromJSDate(events[0].time, { zone: configurationContext.configuration.location.timeZoneLabel }).startOf('day');
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
				lowest: minEvent,
				highest: maxEvent,
				events: events,
				outsidePrevious: previousDayEvents[previousDayEvents.length - 1],
				outsideNext: nextDayEvents[0]
			});
		}
	});

	let minHeight: number = Infinity;
	let maxHeight: number = -Infinity;

	let minEvent: TideEvent = null!;
	let maxEvent: TideEvent = null!;

	longTermEventRanges.forEach(function (r) {
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