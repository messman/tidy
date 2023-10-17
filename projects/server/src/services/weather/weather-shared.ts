import { DateTime } from 'luxon';
import {
	AstroDay, AstroLunarPhaseDay, AstroSolarEvent, AstroSunDay, AstroSunRiseSet, mapNumberEnumValue, WeatherIndicator, WeatherPointCurrent, WeatherPointDaily, WeatherPointHourly, WeatherStatusType,
	WeatherWindDirection, WithDaytime
} from '@wbtdevlocal/iso';
import { BaseConfig } from '../config';
import { createTimeIterator } from './iterator';

export function createWeatherPointHourlyId(time: DateTime): string {
	return `wh-${time.toMillis()}`;
}

/** Converts angle degrees to cardinal directions. */
export function degreesToDirection(value: number): WeatherWindDirection {
	// We are presuming that 0 degrees is N.
	// 90 degrees is N to E, 45 is N to NE, 22.5 is N to NNE, 11.5 is to halfway between N and NNE.
	// Use that logic to convert from number [0, 360] to direction.

	let directionValue = Math.floor((value + 11.25) / 22.5);
	if (directionValue === 16) {
		directionValue = 0;
	}
	return directionValue as WeatherWindDirection;
};

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
 * Figures out if it's daytime at each hour, and adds in ids for sun events.
*/
function getHourlyWeatherWithDaytimeAndSun(referenceTime: DateTime, solarEventMap: Map<string, AstroSolarEvent>, sunDayMap: Map<number, AstroSunDay>, hourly: WeatherPointHourly[]): (WithDaytime<WeatherPointHourly> | AstroSunRiseSet)[] {
	// Track the days we use.
	const solarDays = new Set<AstroSunDay>();

	// Get the daytime/nighttime for each hour.
	const hourlyWithDaytime = hourly.map<WithDaytime<WeatherPointHourly>>((hourly) => {
		const sunDay = sunDayMap.get(hourly.time.startOf('day').toMillis())!;
		const rise = solarEventMap.get(sunDay.riseId)!;
		const set = solarEventMap.get(sunDay.setId)!;
		const isDaytime = hourly.time > rise.time && hourly.time < set.time;

		// Track this day to use later...
		solarDays.add(sunDay);

		return {
			...hourly,
			isDaytime
		};
	});

	const all: (WithDaytime<WeatherPointHourly> | AstroSunRiseSet)[] = [...hourlyWithDaytime];

	// Now, add these rise and set times.
	Array.from(solarDays.values()).forEach((sunDay) => {
		all.push(
			{
				id: sunDay.riseId,
				isSunrise: true,
				time: solarEventMap.get(sunDay.riseId)!.time
			} satisfies AstroSunRiseSet,
			{
				id: sunDay.setId,
				isSunrise: false,
				time: solarEventMap.get(sunDay.setId)!.time
			} satisfies AstroSunRiseSet
		);
	});

	const lastWeather = hourlyWithDaytime.at(-1)!;
	// Sort (non optimized).
	all.sort((a, b) => {
		return a.time.valueOf() - b.time.valueOf();
	});

	// Ensure that our sun events are after the reference time and before the last hourly weather.
	return all.filter((value) => {
		return value.time > referenceTime && value.time <= lastWeather.time;
	});
}

/** Find the first hourly weather value that is a different indicator than the current weather. */
function getIndicatorChangeHourlyId(currentWeatherIndicator: WeatherIndicator, hourly: WeatherPointHourly[]): string | null {
	return hourly.find((hourly) => {
		return hourly.indicator !== currentWeatherIndicator;
	})?.id || null;
}

export interface WeatherAdditionalContext {
	filteredHourlyWithSun: (WithDaytime<WeatherPointHourly> | AstroSunRiseSet)[];
	isCurrentDaytime: boolean;
	indicatorChangeHourlyId: string | null;
}

export function getWeatherAdditionalContext(config: BaseConfig, fetched: WeatherFetched, solarEventMap: Map<string, AstroSolarEvent>, astroDays: AstroDay[]): WeatherAdditionalContext {

	// Filter hourly weather to a lesser amount suitable for ios weather-like hourly scrolling.
	const hourly = fetched.hourly.filter((entry) => {
		return entry.time < config.referenceTime.plus({ hours: 30 });
	});

	const sunDayMap = new Map<number, AstroSunDay>();
	astroDays.forEach((astroDay) => {
		sunDayMap.set(astroDay.time.startOf('day').toMillis(), astroDay.sun);
	});

	return {
		filteredHourlyWithSun: getHourlyWeatherWithDaytimeAndSun(config.referenceTime, solarEventMap, sunDayMap, hourly),
		isCurrentDaytime: getIsCurrentDaytime(solarEventMap, sunDayMap, fetched.current.time),
		indicatorChangeHourlyId: getIndicatorChangeHourlyId(fetched.current.indicator, hourly)
	};
}