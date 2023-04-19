import { Astro } from '@wbtdevlocal/iso';
import { BaseConfig } from '../config';
import { linearFromPoints } from '../test/equation';
import { combineSeed, randomizer, TestSeed } from '../test/randomize';
import { ComputedAstro, getStartOfDayBefore } from './astro-shared';

/**
 * Creates random astro/sun data. Uses a seeded randomizer.
 * 
*/
export function createAstro(config: BaseConfig, seed: TestSeed): ComputedAstro {
	const sunRandomizer = randomizer(combineSeed('_sun_', seed));

	const { referenceTime, futureCutoff } = config;
	const startDay = getStartOfDayBefore(referenceTime);
	const endDay = futureCutoff;
	const daysBetween = endDay.diff(startDay, 'days').days;

	// sunrise (function) - ([5:30,7] to [5:30,7]) - linear
	const minSunriseMinutes = 5.5 * 60;
	const maxSunriseMinutes = 7 * 60;
	const startingSunriseMinutes = sunRandomizer.randomInt(minSunriseMinutes, maxSunriseMinutes, true);
	const endingSunriseMinutes = sunRandomizer.randomInt(minSunriseMinutes, maxSunriseMinutes, true);

	const sunriseMinutesFunc = linearFromPoints([0, startingSunriseMinutes], [daysBetween, endingSunriseMinutes]);
	const sunriseMinutes: number[] = [];
	for (let i = 0; i < daysBetween; i++) {
		sunriseMinutes.push(Math.floor(sunriseMinutesFunc(i)));
	}

	// sunset (function) - ([18,19] to [18,19]) - linear
	const minSunsetMinutes = 18 * 60;
	const maxSunsetMinutes = 19 * 60;
	const startingSunsetMinutes = sunRandomizer.randomInt(minSunsetMinutes, maxSunsetMinutes, true);
	const endingSunsetMinutes = sunRandomizer.randomInt(minSunsetMinutes, maxSunsetMinutes, true);

	const sunsetMinutesFunc = linearFromPoints([0, startingSunsetMinutes], [daysBetween, endingSunsetMinutes]);
	const sunsetMinutes: number[] = [];
	for (let i = 0; i < daysBetween; i++) {
		sunsetMinutes.push(Math.floor(sunsetMinutesFunc(i)));
	}

	// Combine our events
	const days: Astro.SunDay[] = [];
	for (let i = 0; i < daysBetween; i++) {
		const day = startDay.plus({ days: i });
		days.push({
			rise: day.plus({ minutes: sunriseMinutes[i] }),
			set: day.plus({ minutes: sunsetMinutes[i] }),
		});
	}

	return {
		daily: days
	};
}