import { DateTime } from 'luxon';
import { TidePointExtreme } from '@wbtdevlocal/iso';
import { BaseConfig } from '../config';
import { combineSeed, randomizer, TestSeed } from '../test/randomize';
import { getStartOfDayBefore } from '../time';
import { computeHeightAtTimeBetweenPredictions, createTidePointExtremeId, TideFetched } from './tide-shared';

/** Creates random tide data. Uses a seeded randomizer. */
export function createTides(config: BaseConfig, seed: TestSeed): TideFetched {
	const tideRandomizer = randomizer(combineSeed('_tide_', seed));

	const { referenceTime, futureCutoff } = config;
	let startDateTime = getStartOfDayBefore(referenceTime);

	const isAlternate = tideRandomizer.randomFloat(0, 1, 2, true) < .4;

	/*
		If we say our height is "computed", it will be at the reference time.
		Else, we delay our height just a bit to make it more realistic to how the API works.
		We only compute if neither Wells nor Portland is available... which is not often.
	*/
	const isComputed = !isAlternate && tideRandomizer.randomFloat(0, 1, 2, true) < .25;
	const minutesOfDelay = tideRandomizer.randomInt(0, 15, true);
	const measureTime = isComputed ? referenceTime : referenceTime.minus({ minutes: minutesOfDelay });

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

	let previous: TidePointExtreme = null!;
	let next: TidePointExtreme = null!;

	const extrema = eventTimes.map<TidePointExtreme>((time, index) => {
		const isLow = (index + startHighOrLowOffset) % 2 === 0;
		// Low: [0, 2]
		// High: [7, 9]
		const height = isLow ? tideRandomizer.randomFloat(0, 2, 1, true) : tideRandomizer.randomFloat(7, 9, 1, true);
		const extreme: TidePointExtreme = {
			id: createTidePointExtremeId(time),
			time,
			height: height,
			isLow: isLow
		};

		if (time < measureTime) {
			previous = extreme;
		}
		else if (!next && time > measureTime) {
			next = extreme;
		}

		return extreme;
	});

	const height = computeHeightAtTimeBetweenPredictions(previous, next, measureTime);

	return {
		current: {
			computed: height,
			isComputed,
			isAlternate,
			height: height,
			time: measureTime
		},
		extrema
	};
}