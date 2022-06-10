import { DateTime } from 'luxon';
import * as iso from '@wbtdevlocal/iso';
import { BaseConfig } from '../config';
import { combineSeed, randomizer, TestSeed } from '../test/randomize';
import { FetchedTide, getStartOfDayBefore } from './tide-shared';

/** Creates random tide data. Uses a seeded randomizer. */
export function createTides(config: BaseConfig, seed: TestSeed): FetchedTide {
	const tideRandomizer = randomizer(combineSeed('_tide_', seed));

	const { referenceTime, futureCutoff } = config;
	let startDateTime = getStartOfDayBefore(referenceTime);

	// Get our time between highs and lows.
	// This is typically 6 hours 12 minutes and some change, but we'll make it a little random and pretend it's because of the sun.
	const minTimeBetweenHighLowMinutes = (6 * 60) + 3;
	const maxTimeBetweenHighLowMinutes = (6 * 60) + 21;
	const initialMinutesPassed = tideRandomizer.randomInt(0, maxTimeBetweenHighLowMinutes, true);
	startDateTime = startDateTime.plus({ minutes: initialMinutesPassed });
	const eventTimes: DateTime[] = [];
	while (startDateTime < futureCutoff) {
		eventTimes.push(startDateTime);

		// Set up next...
		const minutesPassed = tideRandomizer.randomInt(minTimeBetweenHighLowMinutes, maxTimeBetweenHighLowMinutes, true);
		startDateTime = startDateTime.plus({ minutes: minutesPassed });
	}

	const startHighOrLowOffset = tideRandomizer.randomInt(0, 1, true);

	let previous: iso.Tide.ExtremeStamp = null!;
	let next: iso.Tide.ExtremeStamp = null!;

	const extrema = eventTimes.map<iso.Tide.ExtremeStamp>((time, index) => {
		const isLow = (index + startHighOrLowOffset) % 2 === 0;
		// Low: [0, 2]
		// High: [7, 9]
		const height = isLow ? tideRandomizer.randomFloat(0, 2, 1, true) : tideRandomizer.randomFloat(7, 9, 1, true);
		const extreme: iso.Tide.ExtremeStamp = {
			time,
			height: height,
			isLow: isLow
		};

		if (time < referenceTime) {
			previous = extreme;
		}
		else if (!next && time > referenceTime) {
			next = extreme;
		}

		return extreme;
	});

	// Do an estimation of the current height based on previous and next.
	const minutesBetweenReferenceAndPrevious = Math.max(0, referenceTime.diff(previous.time, 'minutes').minutes);
	const minutesBetweenNextAndPrevious = next.time.diff(previous.time, 'minutes').minutes;

	const percentFromPreviousToNext = minutesBetweenReferenceAndPrevious / minutesBetweenNextAndPrevious;
	const height = (percentFromPreviousToNext * (next.height - previous.height)) + previous.height;
	const heightWithPrecision = parseFloat(height.toFixed(1));

	return {
		currentTime: referenceTime,
		currentHeight: heightWithPrecision,
		extrema
	};
}