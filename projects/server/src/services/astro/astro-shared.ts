import { DateTime } from 'luxon';
import { AstroDay, AstroLunarPhase, AstroLunarPhaseDay, AstroSolarEvent, AstroSolarEventType, AstroSunDay } from '@wbtdevlocal/iso';
import { BaseConfig } from '../config';
import { getStartOfDayBefore } from '../time';

export function createSolarEvent(time: DateTime, type: AstroSolarEventType): AstroSolarEvent {
	return {
		id: `sol-${time.toMillis()}`,
		time,
		type
	};
}

export interface AstroFetched {
	solarEvents: AstroSolarEvent[];
	sunDays: AstroSunDay[];
}

export interface SunRelativity {
	/** May include mid-day. */
	previousId: string;
	/** May include mid-day. May be set if we are close enough to a sun event. */
	currentId: string | null;
	nextRiseSetTwilightId: string;
	nextRiseSetId: string;
}

export interface SunCloseDays {
	yesterday: AstroSunDay;
	today: AstroSunDay;
	tomorrow: AstroSunDay;
}

export interface AstroAdditionalContext {
	days: AstroDay[];
	solarEventMap: Map<string, AstroSolarEvent>;
	sunRelativity: SunRelativity;
	sunCloseDays: SunCloseDays;
	todayAstroDay: AstroDay;
}

/** If we are within this time (on either side), consider the event current. */
const currentEventBoundMinutes = 10;

/** Gets [previous, current, next].  */
function getSunRelativity(config: BaseConfig, fetched: AstroFetched): SunRelativity {

	const { referenceTime } = config;
	const { solarEvents } = fetched;
	const referenceTimeCurrentLowerBound = referenceTime.minus({ minutes: currentEventBoundMinutes });
	const referenceTimeCurrentUpperBound = referenceTime.plus({ minutes: currentEventBoundMinutes });

	let previous: AstroSolarEvent = null!;
	let current: AstroSolarEvent | null = null;
	let nextRiseSetTwilight: AstroSolarEvent = null!;
	let nextRiseSet: AstroSolarEvent = null!;

	for (let i = 0; i < solarEvents.length; i++) {
		const solarEvent = solarEvents[i];

		if (!previous) {
			// Be fuzzy on the time - accept that we're at an extreme within a certain time range of the current time.
			if (solarEvent.time >= referenceTimeCurrentLowerBound && solarEvent.time <= referenceTimeCurrentUpperBound) {
				current = solarEvent;
				previous = solarEvents[i - 1];
				continue;
			}
			// Else check for next
			else if (solarEvent.time > referenceTime) {
				previous = solarEvents[i - 1];
			}
		}
		if (previous) {
			// Now, check for the next solar events
			if (!nextRiseSetTwilight && solarEvent.type !== AstroSolarEventType.midday) {
				nextRiseSetTwilight = solarEvent;
			}
			if (!nextRiseSet && (solarEvent.type === AstroSolarEventType.rise || solarEvent.type === AstroSolarEventType.set)) {
				nextRiseSet = solarEvent;
			}
			if (!!nextRiseSetTwilight && !!nextRiseSet) {
				break;
			}
		}
	}

	return {
		previousId: previous.id,
		currentId: current?.id || null,
		nextRiseSetId: nextRiseSet.id,
		nextRiseSetTwilightId: nextRiseSetTwilight.id
	};
}

/**
 * Returns [yesterday, today, tomorrow].
 * Sun data we have for the previous day; moon data we only have for the current day.
 */
function getSunCloseDays(config: BaseConfig, fetched: AstroFetched, solarEventMap: Map<string, AstroSolarEvent>): SunCloseDays {
	const { referenceTime } = config;
	const { sunDays } = fetched;

	const yesterday = getStartOfDayBefore(referenceTime);

	for (let i = 0; i < sunDays.length; i++) {
		const sunDay = sunDays[i];
		if (solarEventMap.get(sunDay.civilDawnId)!.time.hasSame(yesterday, 'day')) {
			return {
				yesterday: sunDay,
				today: sunDays[i + 1],
				tomorrow: sunDays[i + 2]
			};
		}
	}
	return null!;
}

// /**
//  * Returns [next, nextLunarDay].
//  * Sun data we have for the previous day; moon data we only have for the current day.
//  */
// export function getNextLunarDay(weather: WeatherFetched): Astro.LunarDay {
// 	const { lunar } = weather;

// 	let rise: Astro.BodyEvent = null!;

// 	for (let i = 0; i < lunar.length; i++) {
// 		const event = lunar[i];
// 		if (event.isRise) {
// 			rise = event;
// 		}
// 		else if (rise) {
// 			return {
// 				rise: rise.time,
// 				set: event.time
// 			};
// 		}
// 	}
// 	return null!;
// }


export function getAstroAdditionalContext(config: BaseConfig, fetched: AstroFetched, lunarDays: AstroLunarPhaseDay[]): AstroAdditionalContext {

	// Create a map of solar events for easy access.
	const solarEventMap = new Map<string, AstroSolarEvent>();
	fetched.solarEvents.forEach((solarEvent) => {
		solarEventMap.set(solarEvent.id, solarEvent);
	});

	// Merge phase days with sun time days.
	const lunarDayMap = new Map<number, AstroLunarPhase>;
	lunarDays.forEach((lunarDay) => {
		lunarDayMap.set(lunarDay.time.startOf('day').toMillis(), lunarDay.moon);
	});
	const days: AstroDay[] = [];
	let todayAstroDay: AstroDay = null!;
	fetched.sunDays.forEach((sunDay) => {
		const day = solarEventMap.get(sunDay.civilDawnId)!.time.startOf('day');
		const phase = lunarDayMap.get(day.toMillis());
		if (phase !== undefined) {
			const astroDay: AstroDay = {
				time: day,
				moon: phase,
				sun: sunDay
			};
			days.push(astroDay);
			if (day.hasSame(config.referenceTime, 'day')) {
				todayAstroDay = astroDay;
			}
		}
	});
	return {
		sunRelativity: getSunRelativity(config, fetched),
		sunCloseDays: getSunCloseDays(config, fetched, solarEventMap),
		days,
		solarEventMap,
		todayAstroDay
	};
}