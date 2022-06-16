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

export type WithoutIndicator<T> = Omit<T, 'indicator'>;

export function fixFetchedWeather(config: BaseConfig, fetchedWeather: FetchedWeather): FetchedWeather {
	const { current, hourly, daily, moonPhaseDaily, lunar } = fetchedWeather;

	const { referenceTime, futureCutoff } = config;
	const hourlyLimit = futureCutoff;
	const dailyLimit = futureCutoff;

	const iterableHourly = hourly
		.filter((entry) => {
			// Discard any from before our reference time (the current hour, for example)
			return entry.time > referenceTime;
		})
		.map((entry, i, arr) => {
			const next = arr[i + 1];
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

	// Go to the start of the next hour, since we disregarded this current hour.
	// Note - end of hour and start of hour are not the same.
	const currentHour = referenceTime.plus({ hours: 1 }).startOf("hour");
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


/** The best possible ideal that can be assigned to a weather status. */
const statusIndicator: Record<keyof typeof iso.Weather.StatusType, iso.Weather.Indicator> = {
	clear: iso.Weather.Indicator.best,
	clear_hot: iso.Weather.Indicator.best,
	clear_cold: iso.Weather.Indicator.best,
	clouds_few: iso.Weather.Indicator.best,
	clouds_some: iso.Weather.Indicator.best,

	clouds_most: iso.Weather.Indicator.okay,
	dust: iso.Weather.Indicator.okay,
	smoke: iso.Weather.Indicator.okay,
	unknown: iso.Weather.Indicator.okay,
	clouds_over: iso.Weather.Indicator.okay,
	rain_drizzle: iso.Weather.Indicator.okay,
	rain_light: iso.Weather.Indicator.okay,
	haze: iso.Weather.Indicator.okay,
	fog: iso.Weather.Indicator.okay,

	thun_light: iso.Weather.Indicator.bad,
	snow_light: iso.Weather.Indicator.bad,
	rain_medium: iso.Weather.Indicator.bad,
	rain_heavy: iso.Weather.Indicator.bad,
	rain_freeze: iso.Weather.Indicator.bad,
	snow_medium: iso.Weather.Indicator.bad,
	snow_heavy: iso.Weather.Indicator.bad,
	snow_sleet: iso.Weather.Indicator.bad,
	snow_rain: iso.Weather.Indicator.bad,
	thun_medium: iso.Weather.Indicator.bad,
	thun_heavy: iso.Weather.Indicator.bad,
	intense_storm: iso.Weather.Indicator.bad,
	intense_other: iso.Weather.Indicator.bad,
};

export function getIndicator(entry: Omit<iso.Weather.CommonCurrentHourly | iso.Weather.Day, 'indicator'>): iso.Weather.Indicator {
	const { status } = entry;

	// If the best scenario is bad, just say it's bad
	const ideal = iso.mapEnumValue(iso.Weather.StatusType, statusIndicator, status);
	if (ideal === iso.Weather.Indicator.bad) {
		return iso.Weather.Indicator.bad;
	}

	// // If there's a good chance of rain, no beach time.
	// if (pop >= .8) {
	// 	return iso.Weather.Indicator.bad;
	// }

	return ideal;
}