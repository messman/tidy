import { DateTime } from 'luxon';
import { Astro, mapNumberEnumValue, Weather } from '@wbtdevlocal/iso';
import { BaseConfig } from '../config';
import { createTimeIterator } from './iterator';

export interface FetchedWeather {
	current: Weather.Current;
	/** Note: contains no past data. */
	hourly: Weather.Hourly[];
	/** Note: contains no past data past the start of the current day. */
	daily: Weather.Day[];
	/** Moon phase each day at noon. */
	moonPhaseDaily: Astro.MoonPhaseDay[];
	lunar: Astro.BodyEvent[];
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
	const iteratedHourly: Weather.Hourly[] = [];

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
export function filterHourlyWeather(config: BaseConfig, entry: Weather.Hourly): boolean {
	return entry.time < config.referenceTime.plus({ hours: 30 });
}


/** The best possible ideal that can be assigned to a weather status. */
const statusIndicator: Record<keyof typeof Weather.StatusType, Weather.Indicator> = {
	clear: Weather.Indicator.best,
	clear_hot: Weather.Indicator.best,
	clear_cold: Weather.Indicator.best,
	clouds_few: Weather.Indicator.best,
	clouds_some: Weather.Indicator.best,
	clouds_most: Weather.Indicator.best,

	dust: Weather.Indicator.okay,
	smoke: Weather.Indicator.okay,
	unknown: Weather.Indicator.okay,
	clouds_over: Weather.Indicator.okay,
	rain_drizzle: Weather.Indicator.okay,
	rain_light: Weather.Indicator.okay,
	haze: Weather.Indicator.okay,
	fog: Weather.Indicator.okay,

	thun_light: Weather.Indicator.bad,
	snow_light: Weather.Indicator.bad,
	rain_medium: Weather.Indicator.bad,
	rain_heavy: Weather.Indicator.bad,
	rain_freeze: Weather.Indicator.bad,
	snow_medium: Weather.Indicator.bad,
	snow_heavy: Weather.Indicator.bad,
	snow_sleet: Weather.Indicator.bad,
	snow_rain: Weather.Indicator.bad,
	thun_medium: Weather.Indicator.bad,
	thun_heavy: Weather.Indicator.bad,
	intense_storm: Weather.Indicator.bad,
	intense_other: Weather.Indicator.bad,
};

export function getIndicator(entry: Omit<Weather.CommonCurrentHourly | Weather.Day, 'indicator'>): Weather.Indicator {
	const { status } = entry;

	// If the best scenario is bad, just say it's bad
	const ideal = mapNumberEnumValue(Weather.StatusType, statusIndicator, status);
	if (ideal === Weather.Indicator.bad) {
		return Weather.Indicator.bad;
	}

	// // If there's a good chance of rain, no beach time.
	// if (pop >= .8) {
	// 	return iso.Weather.Indicator.bad;
	// }

	return ideal;
}