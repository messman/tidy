import { DateTime } from 'luxon';
import { constant, TidePoint, TidePointExtremeComp } from '@wbtdevlocal/iso';
import { BaseConfig } from '../config';
import { combineSeed, randomizer, TestSeed } from '../test/randomize';
import { getStartOfDayBefore } from '../time';
import { createTidePointExtremeId, getComputedBetweenPredictions, TideFetched } from './tide-shared';

/** Creates random tide data. Uses a seeded randomizer. */
export function createTides(config: BaseConfig, seed: TestSeed): TideFetched {
	const tideRandomizer = randomizer(combineSeed('_tide_', seed));

	const { referenceTime, futureCutoff } = config;
	let startDateTime = getStartOfDayBefore(referenceTime);

	// Get our time between highs and lows.
	// This is typically 6 hours 12 minutes and some change, but we'll make it a little random.
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

	const extrema = eventTimes.map<TidePointExtremeComp>((time, index) => {
		const isLow = (index + startHighOrLowOffset) % 2 === 0;
		const height = isLow ? tideRandomizer.randomFloat(-.5, 1.5, 1, true) : tideRandomizer.randomFloat(7, 11, 1, true);


		let ofs: TidePoint | null = null;
		if (time > referenceTime.minus({ hour: 1 }) && time < referenceTime.plus({ hours: 72 })) {
			ofs = {
				height: isLow ? tideRandomizer.shake(-5, 1.5, 1, height, .3, true) : tideRandomizer.shake(7, 11, 1, height, .3, true),
				time
			};
		}

		const extreme: TidePointExtremeComp = {
			id: createTidePointExtremeId(time, 'test'),
			time,
			height: ofs ? ofs.height : height,
			isLow,
			astro: { time, height },
			ofs
		};
		return extreme;
	});

	const computed = getComputedBetweenPredictions(config, extrema);

	const waterTemp = tideRandomizer.randomInt(45, 70, true);

	return {
		waterTemp,
		current: computed.height,
		source: {
			ofsRetries: 0,
			ofsOffset: 1000,
			ofsEntryTimeUtc: referenceTime.setZone('utc'),
			ofsStation: { lat: constant.latitude, lon: constant.longitude },
			portland: { height: computed.height, time: referenceTime },
			astroComputed: computed,
			computed: computed,
			ofsComputed: computed,
			ofsInterval: { height: computed.height, time: referenceTime },
		},
		extrema
	};
}