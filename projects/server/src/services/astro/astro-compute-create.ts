import { AstroSolarEvent, AstroSolarEventType, AstroSunDay } from '@wbtdevlocal/iso';
import { BaseConfig } from '../config';
import { linearFromPoints } from '../test/equation';
import { combineSeed, randomizer, TestSeed } from '../test/randomize';
import { getStartOfDayBefore } from '../time';
import { AstroFetched, createSolarEvent } from './astro-shared';

/**
 * Creates random astro/sun data. Uses a seeded randomizer.
 * 
*/
export function createAstro(config: BaseConfig, seed: TestSeed): AstroFetched {
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
	const events: AstroSolarEvent[] = [];
	const days: AstroSunDay[] = [];
	for (let i = 0; i < daysBetween; i++) {
		const day = startDay.plus({ days: i });

		const rise = day.plus({ minutes: sunriseMinutes[i] });
		const set = day.plus({ minutes: sunsetMinutes[i] });

		// Pretty consistently 30 minutes for civil twilight (at least for southern Maine!)
		const civilDawn = rise.minus({ minutes: 30 });
		const civilDusk = set.plus({ minutes: 30 });

		// Set midday to be halfway between rise and set (which is close enough).
		const midday = rise.plus({ minutes: Math.round(set.diff(rise, 'minutes').minutes / 2) });

		const civilDawnEvent = createSolarEvent(civilDawn, AstroSolarEventType.civilDawn);
		const riseEvent = createSolarEvent(rise, AstroSolarEventType.rise);
		const middayEvent = createSolarEvent(midday, AstroSolarEventType.midday);
		const setEvent = createSolarEvent(set, AstroSolarEventType.set);
		const civilDuskEvent = createSolarEvent(civilDusk, AstroSolarEventType.civilDusk);

		days.push({
			civilDawnId: civilDawnEvent.id,
			riseId: riseEvent.id,
			middayId: middayEvent.id,
			setId: setEvent.id,
			civilDuskId: civilDuskEvent.id
		});
		events.push(civilDawnEvent, riseEvent, middayEvent, setEvent, civilDuskEvent);
	}

	return {
		solarEvents: events,
		sunDays: days
	};
}