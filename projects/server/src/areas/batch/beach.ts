import { DateTime } from 'luxon';
import { AstroSolarEvent, AstroSolarEventType, BeachTimeDay, BeachTimeRange, isInNumberEnum, Range, TideLevelBeachStatus, TidePointExtreme, WeatherIndicator } from '@wbtdevlocal/iso';
import { AstroAdditionalContext, AstroFetched } from '../../services/astro/astro-shared';
import { BaseConfig } from '../../services/config';
import { TideAdditionalContext, TideFetched } from '../../services/tide/tide-shared';
import { WeatherFetched } from '../../services/weather/weather-shared';

interface BeachMark {
	time: DateTime;
}

interface BeachMarkTideLow extends BeachMark {
	id: string;
	isForTideLow: true;
}
function isBeachMarkTideLow(value: unknown): value is BeachMarkTideLow {
	return !!value && (value as BeachMarkTideLow).isForTideLow;
}

interface BeachMarkTideBeachChange extends BeachMark {
	toStatus: TideLevelBeachStatus;
	isForTideBeachChange: true;
}
function isBeachMarkTideBeachChange(value: unknown): value is BeachMarkTideBeachChange {
	return !!value && (value as BeachMarkTideBeachChange).isForTideBeachChange;
}

interface BeachMarkSun extends BeachMark {
	id: string;
	isForSun: true;
}
function isBeachMarkSun(value: unknown): value is BeachMarkSun {
	return !!value && (value as BeachMarkSun).isForSun;
}

interface BeachMarkWeather extends BeachMark {
	toIndicator: WeatherIndicator;
	isForWeather: true;
}
function isBeachMarkWeather(value: unknown): value is BeachMarkWeather {
	return !!value && (value as BeachMarkWeather).isForWeather;
}

function parseBeachMark(value: unknown) {
	return {
		beachMarkTideLow: isBeachMarkTideLow(value) ? value : null,
		beachMarkTideBeachChange: isBeachMarkTideBeachChange(value) ? value : null,
		beachMarkSun: isBeachMarkSun(value) ? value : null,
		beachMarkWeather: isBeachMarkWeather(value) ? value : null
	};
}

function getOrderedBeachMarks(
	tideFetched: TideFetched,
	tideAdditional: TideAdditionalContext,
	astroFetched: AstroFetched,
	weatherFetched: WeatherFetched,
): BeachMark[] {

	const { extrema } = tideFetched;
	const { beachChanges } = tideAdditional;
	const { solarEvents } = astroFetched;
	const { daily, hourly } = weatherFetched;

	const beachMarks: BeachMark[] = [];

	extrema.filter(e => e.isLow).forEach((extreme) => {
		const beachMark = {
			time: extreme.time,
			id: extreme.id,
			isForTideLow: true,
		} satisfies BeachMarkTideLow;
		beachMarks.push(beachMark);
	});

	beachChanges.forEach((beachChange) => {
		const beachMark = {
			time: beachChange.time,
			toStatus: beachChange.toStatus,
			isForTideBeachChange: true
		} satisfies BeachMarkTideBeachChange;
		beachMarks.push(beachMark);
	});

	solarEvents.forEach((solarEvent) => {
		const beachMark = {
			time: solarEvent.time,
			id: solarEvent.id,
			isForSun: true
		} satisfies BeachMarkSun;
		beachMarks.push(beachMark);
	});

	const hourlyWeatherMarks = hourly.map<BeachMarkWeather>((hourly) => {
		return {
			time: hourly.time,
			toIndicator: hourly.indicator,
			isForWeather: true,
		};
	});
	const dailyWeatherMarks = daily.map<BeachMarkWeather>((daily) => {
		return {
			time: daily.time,
			toIndicator: daily.indicator,
			isForWeather: true,
		};
	});

	/*
		Get the last hourly and use its time as the start of the daily for that day (rewrite that entry).
		Discard all dailies before then.
	*/
	const lastHourly = hourlyWeatherMarks.at(-1)!;
	const all = hourlyWeatherMarks.slice(0, hourlyWeatherMarks.length - 1);
	// Filter days to only those in the same day or later than this last hour.
	const [firstFilteredDay, ...otherFilteredDays] = dailyWeatherMarks.filter((day) => {
		return day.time >= lastHourly.time;
	});
	// Rewrite that first day to use the last hour's time and cover the rest of the day.
	const bridgeDaySpan: BeachMarkWeather = {
		...firstFilteredDay,
		time: lastHourly.time,
	};
	all.push(bridgeDaySpan, ...otherFilteredDays);
	beachMarks.push(...all);

	// This sorting could be made more efficient with a merge implementation, but it's not a major issue.
	beachMarks.sort((a, b) => {
		return a.time.toMillis() - b.time.toMillis();
	});
	return beachMarks;
}



function getBeachTimeRanges(
	config: BaseConfig,
	tideFetched: TideFetched,
	tideAdditional: TideAdditionalContext,
	astroFetched: AstroFetched,
	astroAdditional: AstroAdditionalContext,
	weatherFetched: WeatherFetched,
	//weatherAdditional: WeatherAdditionalContext
): BeachTimeRange[] {

	/*
		Previous versions of "beach time" focused on three separate variables that all had an effect on beach time: sun, weather, and tides.
		Furthermore, it focused on a good/okay/bad state for each.
		Furthermore, we couldn't show past data (for the current day) because we relied on weather. 

		Newer "beach time" definitions instead just consider sun and tides; weather is just used as additional context. And there's less focus on good/okay/bad.
		That should simplify the algorithm slightly.
		
		Still, though, it's tough: we have to go through each of these pieces in order like a timeline we're running our finger across.

		Things we can assume about beach time ranges:
		- They won't split between days
		- They always have a low tide associated with them, even if that low tide is outside the range (due to nighttime) or outside the day

		Data ranges:
		- Moon phase data, weather data: 8 days
		- Tide data: includes day before
		- Sun data: includes day before
	*/
	const { referenceTime } = config;

	let beachTimeRanges: BeachTimeRange[] = [];

	const { solarEventMap } = astroAdditional;
	const beachMarks = getOrderedBeachMarks(tideFetched, tideAdditional, astroFetched, weatherFetched);
	const startOfCurrentDay = referenceTime.startOf('day');

	// Start with no beach time because we're starting at the start of the current day.
	let trackedBeachTime: BeachTimeRange | null = null;
	// Track the *multiple* low tides that might need to be associated with a single range. #REF_BEACH_LOW_TIDE_ASSOCIATION
	let mostRecentLowTides: BeachMarkTideLow[] = [];
	let mostRecentMajorSolarEvent: AstroSolarEvent | null = null;
	let isBeachUncovered: boolean = false;
	let mostRecentWeather: BeachMarkWeather | null = null;

	let hasTriedToFindWeatherForCurrentDay = false;

	beachMarks.forEach((beachMark) => {

		const { time } = beachMark;
		const { beachMarkTideLow, beachMarkTideBeachChange, beachMarkSun, beachMarkWeather } = parseBeachMark(beachMark);

		/*
			Handle this above the line where we return early for the day before the current day. Just in case. It would be crazy rare.
			But see other code where we associate the low tide. #REF_BEACH_LOW_TIDE_ASSOCIATION
		*/
		if (beachMarkTideLow) {
			mostRecentLowTides.push(beachMarkTideLow);
		}
		/*
			Check for covering. If that happens, our low tide can't possibly be used for
			the next beach time. #REF_BEACH_LOW_TIDE_ASSOCIATION
		*/
		if (beachMarkTideBeachChange && beachMarkTideBeachChange.toStatus !== TideLevelBeachStatus.uncovered) {
			mostRecentLowTides = [];
		}

		/** At this point, skip to the next if it's the day before the current day (since we don't have all the data necessary for that). */
		const startOfDayForTime = time.startOf('day');
		if (startOfDayForTime < startOfCurrentDay) {
			return;
		}

		/*
			If it's our current day, and we don't have recent weather, pre-load the weather for this day.
			We may have to start tracking a beach time before we have hourly weather available, but we should have
			daily weather.
		*/
		if (!mostRecentWeather && !hasTriedToFindWeatherForCurrentDay && time.hasSame(referenceTime, 'day')) {
			hasTriedToFindWeatherForCurrentDay = true;
			const weatherForCurrentDay = weatherFetched.daily.find((daily) => {
				return daily.time.hasSame(referenceTime, 'day');
			});
			if (weatherForCurrentDay) {
				mostRecentWeather = {
					time: weatherForCurrentDay.time,
					toIndicator: weatherForCurrentDay.indicator,
					isForWeather: true
				};
			}
		}

		if (beachMarkSun) {
			const solarEvent = solarEventMap.get(beachMarkSun.id)!;
			if (solarEvent.type === AstroSolarEventType.civilDawn || solarEvent.type === AstroSolarEventType.civilDusk) {
				mostRecentMajorSolarEvent = solarEvent;
			}
		}
		if (beachMarkTideBeachChange) {
			isBeachUncovered = beachMarkTideBeachChange.toStatus === TideLevelBeachStatus.uncovered;
		}
		if (beachMarkWeather) {
			mostRecentWeather = beachMarkWeather;
		}

		if (trackedBeachTime != null) {
			/*
				If in beach time, 
				- Check for reasons to end it (beach change, solar event)
				- Record sun and tide and weather events that could happen during it
			*/
			let shouldStop = false;

			if (beachMarkSun) {
				// Always track it in our range.
				trackedBeachTime.solarEventIds.push(beachMarkSun.id);

				const solarEvent = solarEventMap.get(beachMarkSun.id)!;
				if (solarEvent.type === AstroSolarEventType.civilDusk) {
					shouldStop = true;
				}
			}
			else if (beachMarkTideLow) {
				trackedBeachTime.tideLowIds.push(beachMarkTideLow.id);
				mostRecentLowTides = []; // Prevent any tracking.
			}
			else if (beachMarkTideBeachChange) {
				// Check for the end condition (beach starting to cover)
				if (beachMarkTideBeachChange.toStatus !== TideLevelBeachStatus.uncovered) {
					shouldStop = true;
				}
			}
			else if (beachMarkWeather) {
				if (trackedBeachTime.weather === WeatherIndicator.best && beachMarkWeather.toIndicator !== WeatherIndicator.best) {
					trackedBeachTime.weather = beachMarkWeather.toIndicator;
				}
				else if (trackedBeachTime.weather === WeatherIndicator.okay && beachMarkWeather.toIndicator === WeatherIndicator.bad) {
					trackedBeachTime.weather = beachMarkWeather.toIndicator;
				}
				else {
					// Already bad
				}
			}

			if (shouldStop) {
				// End
				trackedBeachTime.stop = time;
				trackedBeachTime = null;
			}
		}
		else {
			/*
				If not in beach time,
				- Check for start conditions to be fully aligned
				- Track pieces that could indicate it's time to start
			*/

			if (beachMarkSun) {
				// Nothing extra to track
			}
			else if (beachMarkTideLow) {
				/*
					Check if this low should be associated with a previous beach time, like one that ended
					due to lost light. #REF_BEACH_LOW_TIDE_ASSOCIATION
				*/
				if (beachTimeRanges.length && mostRecentLowTides.length) {
					const previousBeachTime = beachTimeRanges.at(-1)!;
					// If it doesn't have any, and we're the next low tide, we're for that beach time.
					// If there happens to be multiple lows that would work out further into the future, oh well.
					if (!previousBeachTime.tideLowIds.length) {
						previousBeachTime.tideLowIds = mostRecentLowTides.map(x => x.id);
						mostRecentLowTides = []; // Ensure we can't be re-used.
					}
				}
			}
			else if (beachMarkTideBeachChange) {
				// Effects already handled above
			}
			else if (beachMarkWeather) {
				// No effects
			}

			// Our start check
			if (
				isBeachUncovered
				&& (mostRecentMajorSolarEvent !== null && mostRecentMajorSolarEvent.type !== AstroSolarEventType.civilDusk)
			) {

				// Be optimistic? This is for the time before we really know what the weather is (early on current day).
				// So if it's before our reference time, assume we have good weather
				const weather = mostRecentWeather === null ? WeatherIndicator.best : mostRecentWeather.toIndicator;

				// Start
				trackedBeachTime = {
					start: time,
					stop: null!,
					/*
						Because we clear the most recent low tide every time the beach gets covered,
						we should be able to say that when a beach time does begin, and we have a recent low tide,
						this beach time is for that low tide. #REF_BEACH_LOW_TIDE_ASSOCIATION
					*/
					tideLowIds: mostRecentLowTides.map(x => x.id),
					// If it was this sun event that caused the beach time to start, record it! (Likely civil dawn)
					solarEventIds: beachMarkSun ? [beachMarkSun.id] : [],
					weather
				};
				beachTimeRanges.push(trackedBeachTime);
			}
		}
	});

	// Cleanup:
	// Ensure no stop times are still null
	if (trackedBeachTime) {
		beachTimeRanges.pop();
	}

	// Remove any beach times that are less than 30 minutes long, including our current beach time (which could have started well before our start time)
	// Also remove any that are incomplete.
	beachTimeRanges = beachTimeRanges.filter((beachTime) => {
		const isIncomplete = !beachTime.stop || !beachTime.start || !beachTime.tideLowIds.length || !isInNumberEnum(WeatherIndicator, beachTime.weather);
		const isTooShort = !!beachTime.stop && !!beachTime.start && beachTime.stop.diff(beachTime.start, 'minutes').minutes < 30;
		return !isIncomplete && !isTooShort;
	});

	return beachTimeRanges;
}

export function getBeachTimeDays(
	config: BaseConfig,
	tideFetched: TideFetched,
	tideAdditional: TideAdditionalContext,
	astroFetched: AstroFetched,
	astroAdditional: AstroAdditionalContext,
	weatherFetched: WeatherFetched,
): BeachTimeDay[] {

	const beachTimeRanges = getBeachTimeRanges(config, tideFetched, tideAdditional, astroFetched, astroAdditional, weatherFetched);

	const daysMap = new Map<number, BeachTimeDay>();

	function getDayForTime(time: DateTime): BeachTimeDay {
		const startOfDay = time.startOf('day');
		const key = startOfDay.toMillis();
		if (!daysMap.get(key)) {
			daysMap.set(key, {
				day: startOfDay,
				astro: null!,
				weather: null!,
				ranges: [],
				tides: null!
			});
		}
		return daysMap.get(key)!;
	}


	weatherFetched.daily.forEach((daily) => {
		const beachTimeDay = getDayForTime(daily.time);
		beachTimeDay.weather = daily;
	});
	astroAdditional.days.forEach((day) => {
		const beachTimeDay = getDayForTime(day.time);
		beachTimeDay.astro = day;
	});
	beachTimeRanges.forEach((range) => {
		const beachTimeDay = getDayForTime(range.start);
		beachTimeDay.ranges.push(range);
	});
	tideAdditional.extremeDays.forEach((day) => {
		const beachTimeDay = getDayForTime(day.time);
		beachTimeDay.tides = day;
	});

	// Strip out anything incomplete.
	const beachTimeDays = Array.from(daysMap.values()).filter((day) => {
		// We expect every day to have a beach time... it just might be bad weather.
		return day && day.astro && day.weather && day.tides && day.ranges.length;
	});
	return beachTimeDays;
}


/**
 * Gets minimum and maximum tide levels.
 * We must do this after we've found our days, in case we dropped any days due to missing data.
*/
export function getTideMinMaxFromWeek(days: BeachTimeDay[], extremaMap: Map<string, TidePointExtreme>): Range<number> {

	let minHeight: number = Infinity;
	let maxHeight: number = -Infinity;

	let minEvent: TidePointExtreme = null!;
	let maxEvent: TidePointExtreme = null!;

	days.forEach(function (day) {
		const tides = day.tides.extremaIds.map((id) => {
			return extremaMap.get(id)!;
		});

		tides.forEach((t) => {
			if (t.height < minHeight) {
				minHeight = t.height;
				minEvent = t;
			}
			if (t.height > maxHeight) {
				maxHeight = t.height;
				maxEvent = t;
			}
		});
	});

	return {
		min: minEvent.height,
		max: maxEvent.height
	};
};


/**
 * Get the range of max and min for the daily high and low temperatures.
 * We must do this after we've found our days, in case we dropped any days due to missing data.
 */
export function getDailyTempRangeFromWeek(days: BeachTimeDay[]): Range<number> {
	return days.reduce<Range<number>>((output, day) => {
		return {
			min: Math.min(output.min, day.weather.minTemp),
			max: Math.max(output.max, day.weather.maxTemp)
		};
	}, { min: Infinity, max: -Infinity });
}