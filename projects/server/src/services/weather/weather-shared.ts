import { DateTime } from 'luxon';
import * as iso from '@wbtdevlocal/iso';
import { BaseConfig } from '../config';
import { createTimeIterator } from './iterator';

export interface FetchedWeather {
	current: iso.Weather.Current;
	/** Note: contains no past data. */
	hourly: iso.Weather.Hourly[];
	/** Note: contains no past data past the start of the current day. */
	daily: iso.Weather.Day[];
	/** Moon phase each day at noon. */
	moonPhaseDaily: iso.Astro.MoonPhaseDay[];
	lunar: iso.Astro.BodyEvent[];
}

export function fixFetchedWeather(config: BaseConfig, fetchedWeather: FetchedWeather): FetchedWeather {
	const { current, hourly, daily, moonPhaseDaily, lunar } = fetchedWeather;

	const { referenceTime, futureCutoff } = config;
	const hourlyLimit = futureCutoff;
	const dailyLimit = futureCutoff;

	const iterableHourly = hourly.map((entry, i) => {
		const next = hourly[i + 1];
		const nextTime = next?.time || entry.time.plus({ hours: 1 });

		return {
			span: {
				begin: entry.time,
				end: nextTime
			},
			value: entry
		};
	});
	const hourlyIterator = createTimeIterator(iterableHourly);

	const currentHour = referenceTime.startOf("hour");
	// Get the hours between our start hour and our short-term limit
	const shortHoursBetween = hourlyLimit.diff(currentHour, "hours").hours;
	const iteratedHourly: iso.Weather.Hourly[] = [];

	for (let i = 0; i < shortHoursBetween; i++) {
		const dateTime = currentHour.plus({ hours: i });
		const next = hourlyIterator.next(dateTime);
		if (!next) {
			break;
		}
		iteratedHourly.push(next);
	}

	function filterBetweenDays(a: { time: DateTime; }) {
		return a.time >= referenceTime.startOf('day') && a.time <= dailyLimit;
	}

	return {
		current,
		hourly: iteratedHourly,
		daily: daily.filter(filterBetweenDays),
		moonPhaseDaily: moonPhaseDaily.filter(filterBetweenDays),
		lunar: lunar.filter(filterBetweenDays)
	};
}

/** Filters hourly weather to a lesser amount suitable for ios weather-like hourly scrolling. */
export function filterHourlyWeather(config: BaseConfig, entry: iso.Weather.Hourly): boolean {
	return entry.time < config.referenceTime.plus({ hours: 30 });
}