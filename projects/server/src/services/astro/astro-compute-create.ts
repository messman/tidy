import * as iso from '@wbtdevlocal/iso';
import { linearFromPoints } from '../test/equation';
import { combineSeed, randomizer, TestSeed } from '../test/randomize';
import { ComputedAstro } from './astro-compute';
import { AstroConfig } from './astro-config';

/** Creates random astro/sun data. Uses a seeded randomizer. */
export function createComputedAstro(config: AstroConfig, seed: TestSeed): ComputedAstro {
	const sunRandomizer = randomizer(combineSeed('_sun_', seed));

	let startDateTime = config.astro.live.minimumSunDataFetch;
	const endDateTime = config.base.live.maxLongTermDataFetch;
	// Add 2 to our days so we get sunrise and sunset on the end day (which was the start of that day).
	const daysBetween = endDateTime.diff(startDateTime, 'days').days + 2;

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
	const sunEvents: iso.Astro.SunEvent[] = [];
	for (let i = 0; i < daysBetween; i++) {
		const day = startDateTime.plus({ days: i });
		sunEvents.push({
			time: day.plus({ minutes: sunriseMinutes[i] }),
			isSunrise: true,
		});
		sunEvents.push({
			time: day.plus({ minutes: sunsetMinutes[i] }),
			isSunrise: false,
		});
	}

	return {

		sunEvents: sunEvents
	};
}