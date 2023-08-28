import { DateTime } from 'luxon';
import {
	AstroDay, AstroLunarPhaseDay, AstroSolarEvent, AstroSunDay, mapNumberEnumValue, Range, WeatherIndicator, WeatherPointCurrent, WeatherPointDaily, WeatherPointHourly, WeatherStatusType
} from '@wbtdevlocal/iso';
import { BaseConfig } from '../config';
import { createTimeIterator } from './iterator';

export function createWeatherPointHourlyId(time: DateTime): string {
	return `wh-${time.toMillis()}`;
}

/** The best possible ideal that can be assigned to a weather status. */
const statusIndicator: Record<keyof typeof WeatherStatusType, WeatherIndicator> = {
	clear: WeatherIndicator.best,
	clear_hot: WeatherIndicator.best,
	clear_cold: WeatherIndicator.best,
	clouds_few: WeatherIndicator.best,
	clouds_some: WeatherIndicator.best,
	clouds_most: WeatherIndicator.best,

	dust: WeatherIndicator.okay,
	smoke: WeatherIndicator.okay,
	unknown: WeatherIndicator.okay,
	clouds_over: WeatherIndicator.okay,
	rain_drizzle: WeatherIndicator.okay,
	rain_light: WeatherIndicator.okay,
	haze: WeatherIndicator.okay,
	fog: WeatherIndicator.okay,

	thun_light: WeatherIndicator.bad,
	snow_light: WeatherIndicator.bad,
	rain_medium: WeatherIndicator.bad,
	rain_heavy: WeatherIndicator.bad,
	rain_freeze: WeatherIndicator.bad,
	snow_medium: WeatherIndicator.bad,
	snow_heavy: WeatherIndicator.bad,
	snow_sleet: WeatherIndicator.bad,
	snow_rain: WeatherIndicator.bad,
	thun_medium: WeatherIndicator.bad,
	thun_heavy: WeatherIndicator.bad,
	intense_storm: WeatherIndicator.bad,
	intense_other: WeatherIndicator.bad,
};

export function getIndicator(entry: Omit<WeatherPointHourly | WeatherPointDaily, 'indicator'>): WeatherIndicator {
	const { status } = entry;

	// If the best scenario is bad, just say it's bad
	const ideal = mapNumberEnumValue(WeatherStatusType, statusIndicator, status);
	if (ideal === WeatherIndicator.bad) {
		return WeatherIndicator.bad;
	}

	// // If there's a good chance of rain, no beach time.
	// if (pop >= .8) {
	// 	return iso.WeatherIndicator.bad;
	// }

	return ideal;
}

export interface WeatherFetched {
	current: WeatherPointCurrent;
	/** Note: contains no past data. */
	hourly: WeatherPointHourly[];
	/** Note: contains no past data past the start of the current day. */
	daily: WeatherPointDaily[];
	/** Moon phase each day at noon. */
	moonPhaseDaily: AstroLunarPhaseDay[];
	//lunar: Astro.BodyEvent[]; Not doing this for now
}

export type WithoutIndicator<T> = Omit<T, 'indicator'>;

export function fixFetchedWeather(config: BaseConfig, fetchedWeather: WeatherFetched): WeatherFetched {
	const { current, hourly, daily, moonPhaseDaily } = fetchedWeather;

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
	const iteratedHourly: WeatherPointHourly[] = [];

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
		//lunar: lunar.filter(filterBetweenDays)
	};
}

/** Filters hourly weather to a lesser amount suitable for ios weather-like hourly scrolling. */
function filterHourlyWeather(config: BaseConfig, entry: WeatherPointHourly): boolean {
	return entry.time < config.referenceTime.plus({ hours: 30 });
}

/**
 * Figures out if it's daytime at each hour
*/
function getIsCurrentDaytime(solarEventMap: Map<string, AstroSolarEvent>, sunDayMap: Map<number, AstroSunDay>, time: DateTime): boolean {
	const todaySunDay = sunDayMap.get(time.startOf('day').toMillis())!;
	const todayRise = solarEventMap.get(todaySunDay.riseId)!.time;
	const todaySet = solarEventMap.get(todaySunDay.setId)!.time;
	return time >= todayRise && time <= todaySet;
}

/**
 * Figures out if it's daytime at each hour
*/
function getHourlyWeatherWithDaytime(solarEventMap: Map<string, AstroSolarEvent>, sunDayMap: Map<number, AstroSunDay>, hourly: WeatherPointHourly[]): HourlyWithDaytime[] {
	return hourly.map<HourlyWithDaytime>((hourly) => {
		const sunDay = sunDayMap.get(hourly.time.startOf('day').toMillis())!;
		const rise = solarEventMap.get(sunDay.riseId)!.time;
		const set = solarEventMap.get(sunDay.setId)!.time;

		const isDaytime = hourly.time > rise && hourly.time < set;

		return {
			point: hourly,
			isDaytime
		};
	});
}

/** Get the range of max and min for the daily high and low temperatures. */
function getDailyTempRange(daily: WeatherPointDaily[]): Range<number> {
	return daily.reduce<Range<number>>((output, daily) => {
		return {
			min: Math.min(output.min, daily.minTemp),
			max: Math.max(output.max, daily.maxTemp)
		};
	}, { min: Infinity, max: -Infinity });
}

/** Find the first hourly weather value that is a different indicator than the current weather. */
function getIndicatorChangeHourlyId(currentWeatherIndicator: WeatherIndicator, hourly: WeatherPointHourly[]): string | null {
	return hourly.find((hourly) => {
		return hourly.indicator !== currentWeatherIndicator;
	})?.id || null;
}

export interface HourlyWithDaytime {
	point: WeatherPointHourly;
	isDaytime: boolean;
}

export interface WeatherAdditionalContext {
	filteredHourly: HourlyWithDaytime[];
	isCurrentDaytime: boolean;
	indicatorChangeHourlyId: string | null;
	tempRange: Range<number>;
}

export function getWeatherAdditionalContext(config: BaseConfig, fetched: WeatherFetched, solarEventMap: Map<string, AstroSolarEvent>, astroDays: AstroDay[]): WeatherAdditionalContext {

	const hourly = fetched.hourly.filter((entry) => {
		return filterHourlyWeather(config, entry);
	});

	const sunDayMap = new Map<number, AstroSunDay>();
	astroDays.forEach((astroDay) => {
		sunDayMap.set(astroDay.time.startOf('day').toMillis(), astroDay.sun);
	});

	return {
		filteredHourly: getHourlyWeatherWithDaytime(solarEventMap, sunDayMap, hourly),
		isCurrentDaytime: getIsCurrentDaytime(solarEventMap, sunDayMap, fetched.current.time),
		tempRange: getDailyTempRange(fetched.daily),
		indicatorChangeHourlyId: getIndicatorChangeHourlyId(fetched.current.indicator, hourly)
	};
}