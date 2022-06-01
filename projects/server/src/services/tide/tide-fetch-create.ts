import { DateTime } from 'luxon';
import * as iso from '@wbtdevlocal/iso';
import { combineSeed, randomizer, TestSeed } from '../test/randomize';
import { TideConfig } from './tide-config';
import { FetchedTide } from './tide-fetch';

/** Creates random tide data. Uses a seeded randomizer. */
export function createFetchedTide(config: TideConfig, seed: TestSeed): FetchedTide {
	const tideRandomizer = randomizer(combineSeed('_tide_', seed));

	// Get our time between highs and lows.
	// This is typically 6 hours 12 minutes and some change, but we'll make it a little random and pretend it's because of the sun.
	const minTimeBetweenHighLowMinutes = (6 * 60) + 3;
	const maxTimeBetweenHighLowMinutes = (6 * 60) + 21;
	const tideHeightPrecision = config.tide.input.tideHeightPrecision;

	let startDateTime = config.tide.live.minimumTidesDataFetch;
	const endDateTime = config.base.live.maxLongTermDataFetch;

	// Unlike with weather and sun, tide data shifts around all the time - it's not a predictable number of events each day or hour.
	// So we should shift the start of our events randomly as well.
	const initialMinutesPassed = tideRandomizer.randomInt(0, maxTimeBetweenHighLowMinutes, true);
	startDateTime = startDateTime.plus({ minutes: initialMinutesPassed });
	const eventTimes: DateTime[] = [startDateTime];
	while (startDateTime < endDateTime) {
		const minutesPassed = tideRandomizer.randomInt(minTimeBetweenHighLowMinutes, maxTimeBetweenHighLowMinutes, true);
		startDateTime = startDateTime.plus({ minutes: minutesPassed });
		eventTimes.push(startDateTime);
	}

	const referenceTime = config.base.live.referenceTimeInZone;
	const startHighOrLowOffset = tideRandomizer.randomInt(0, 1, true);
	const previousEvents: iso.Tide.TideEvent[] = [];
	const futureEvents: iso.Tide.TideEvent[] = [];
	eventTimes.forEach((time, index) => {

		const isLow = (index + startHighOrLowOffset) % 2 === 0;
		// Low: [0, 2]
		// High: [7, 9]
		const height = isLow ? tideRandomizer.randomFloat(0, 2, tideHeightPrecision, true) : tideRandomizer.randomFloat(7, 9, tideHeightPrecision, true);

		const event: iso.Tide.TideEvent = {
			time: time,
			isLow: isLow,
			height: height
		};

		if (time < referenceTime) {
			previousEvents.push(event);
		}
		else if (time >= referenceTime) {
			futureEvents.push(event);
		}
	});

	// Do an estimation of the current height based on previous and next.
	const previousEvent = previousEvents[previousEvents.length - 1];
	const timeOfPrevious = previousEvent.time;
	const nextEvent = futureEvents[0];
	const timeOfNext = nextEvent.time;
	const minutesBetweenReferenceAndPrevious = Math.max(0, referenceTime.diff(timeOfPrevious, 'minutes').minutes);
	const minutesBetweenNextAndPrevious = timeOfNext.diff(timeOfPrevious, 'minutes').minutes;

	const percentFromPreviousToNext = minutesBetweenReferenceAndPrevious / minutesBetweenNextAndPrevious;
	const height = (percentFromPreviousToNext * (nextEvent.height - previousEvent.height)) + previousEvent.height;
	const heightWithPrecision = parseFloat(height.toFixed(tideHeightPrecision));

	const currentStatus: iso.Tide.TideStatus = {
		time: referenceTime,
		height: heightWithPrecision
	};

	return {
		pastEvents: previousEvents,
		current: currentStatus,
		futureEvents: futureEvents
	};
}