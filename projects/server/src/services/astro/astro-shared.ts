import { DateTime } from 'luxon';
import * as iso from '@wbtdevlocal/iso';
import { BaseConfig } from '../config';
import { FetchedWeather } from '../weather/weather-shared';

export interface ComputedAstro {
	daily: iso.Astro.SunDay[];
}

export function getStartOfDayBefore(day: DateTime): DateTime {
	return day.minus({ days: 1 }).startOf('day');
}

/** If we are within this time (on either side), consider the event current. */
const currentEventBoundMinutes = 15;

export function getSunRelativity(config: BaseConfig, computed: ComputedAstro): iso.Astro.SunRelativity {

	const { referenceTime } = config;
	const referenceTimeCurrentLowerBound = referenceTime.minus({ minutes: currentEventBoundMinutes });
	const referenceTimeCurrentUpperBound = referenceTime.plus({ minutes: currentEventBoundMinutes });

	let previous: iso.Astro.BodyEvent = null!;
	let current: iso.Astro.BodyEvent | null = null;
	let next: iso.Astro.BodyEvent = null!;

	function setRelativity(event: iso.Astro.BodyEvent) {
		const { time } = event;

		if (time < referenceTimeCurrentLowerBound) {
			previous = event;
		}
		else if (time >= referenceTimeCurrentLowerBound && time <= referenceTimeCurrentUpperBound) {
			current = event;
		}
		else if (!next && time > referenceTimeCurrentUpperBound) {
			next = event;
		}
	}

	computed.daily.forEach((day) => {
		const { rise, set } = day;
		setRelativity({ isRise: true, time: rise });
		setRelativity({ isRise: false, time: set });
	});

	return {
		previous,
		current,
		next,
	};
}

/**
 * Returns [yesterday, today, tomorrow].
 * Sun data we have for the previous day; moon data we only have for the current day.
 */
export function getCloseSunDays(config: BaseConfig, computed: ComputedAstro): [iso.Astro.SunDay, iso.Astro.SunDay, iso.Astro.SunDay] {
	const { referenceTime } = config;
	const { daily: dailySun } = computed;

	const yesterday = getStartOfDayBefore(referenceTime);

	for (let i = 0; i < dailySun.length; i++) {
		const sunDay = dailySun[i];
		if (sunDay.rise.hasSame(yesterday, 'day')) {
			return dailySun.slice(i, i + 2) as [iso.Astro.SunDay, iso.Astro.SunDay, iso.Astro.SunDay];
		}
	}
	return null!;
}

/**
 * Returns [next, nextLunarDay].
 * Sun data we have for the previous day; moon data we only have for the current day.
 */
export function getNextLunarDay(weather: FetchedWeather): iso.Astro.LunarDay {
	const { lunar } = weather;

	let rise: iso.Astro.BodyEvent = null!;

	for (let i = 0; i < lunar.length; i++) {
		const event = lunar[i];
		if (event.isRise) {
			rise = event;
		}
		else if (rise) {
			return {
				rise: rise.time,
				set: event.time
			};
		}
	}
	return null!;
}
