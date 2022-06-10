import { DateTime } from 'luxon';
import * as iso from '@wbtdevlocal/iso';
import { ComputedAstro } from '../../services/astro/astro-shared';
import { BaseConfig } from '../../services/config';
import { FetchedTide } from '../../services/tide/tide-shared';
import { FetchedWeather } from '../../services/weather/weather-shared';

export function getTideDays(weather: FetchedWeather, extrema: iso.Tide.ExtremeStamp[]): iso.Batch.TideContentDay[] {
	/*
		Because the moon information has no past data, neither will this data.
	*/
	const days: iso.Batch.TideContentDay[] = [];
	if (!extrema.length || !weather.moonPhaseDaily) {
		return days;
	}
	let moonDayIndex = 0;
	let moonPhaseDay = weather.moonPhaseDaily[moonDayIndex];
	let currentDay: iso.Batch.TideContentDay = {
		extremes: [],
		moonPhase: moonPhaseDay.moon
	};
	days.push(currentDay);
	extrema.forEach((extreme) => {
		if (extreme.time < moonPhaseDay.time.startOf('day')) {
			// Ignore if before our day (to cover past tide data against moon data)
		}
		else if (moonPhaseDay.time.hasSame(extreme.time, 'day')) {
			currentDay.extremes.push(extreme);
		}
		else {
			moonPhaseDay = weather.moonPhaseDaily[moonDayIndex];
			currentDay = {
				extremes: [extreme],
				moonPhase: moonPhaseDay.moon
			};
		}
	});
	return days;
}

export function getBeachContent(config: BaseConfig, tide: FetchedTide, astro: ComputedAstro, weather: FetchedWeather): iso.Batch.BeachContent {
	const { referenceTime } = config;

	/*
		Go through one long list of all the "events" in order. Sort of like if you had them all in front of you
		on a paper and you moved your finger across until you saw all things aligned.

		What we're looking for:
		- When the tide is under our "beach threshold" (must be guessed)
		- When it's daylight
		- When the weather is good
			- For this one, there's "good" weather, "okay" weather, and "bad" weather.
	*/

	// First, use the current data (more accurate) to know whether it's beach time currently.
	const isTideCurrentlyGood = tide.currentHeight <= iso.constant.beachAccessHeight;
	const currentWeatherIdeal = getWeatherIdeal(weather.current);
	let isCurrentDaylight = false;
	for (let i = 0; i < astro.daily.length; i++) {
		const astroDaily = astro.daily[i];
		if (referenceTime >= astroDaily.rise && referenceTime <= astroDaily.set) {
			isCurrentDaylight = true;
			break;
		}
		if (referenceTime > astroDaily.set) {
			break;
		}
	}
	const isStartingInBeachTime = isTideCurrentlyGood && currentWeatherIdeal !== WeatherIdeal.bad && isCurrentDaylight;

	const tideMarks = getBeachTideMarks(tide);
	const sunEvents: iso.Astro.BodyEvent[] = [];
	astro.daily.forEach((day) => {
		sunEvents.push({ isRise: true, time: day.rise }, { isRise: false, time: day.set });
	});
	const weatherEvents = getCombinedWeather(weather.hourly, weather.daily);

	/*
		This sorting could be made more efficient with a merge implementation, but it's not a major issue.
	*/
	const reasons: iso.Batch.BeachTimeReason[] = [...tideMarks, ...sunEvents, ...weatherEvents];
	reasons.sort((a, b) => {
		return a.time.toMillis() - b.time.toMillis();
	});

	let trackedWeatherBlock: iso.Batch.BeachTimeWeatherBlock | null = isStartingInBeachTime ? {
		isBest: currentWeatherIdeal === WeatherIdeal.best,
		start: referenceTime,
		stop: null!
	} : null;
	let trackedBeachTime: iso.Batch.BeachTimeRange | null = isStartingInBeachTime ? {
		start: referenceTime,
		startReasons: [],
		stop: null!,
		stopReasons: [],
		weather: []
	} : null;
	const currentBeachTime: iso.Batch.BeachTimeRange | null = trackedBeachTime;
	const allBeachTimes: iso.Batch.BeachTimeRange[] = [];
	if (trackedBeachTime) {
		allBeachTimes.push(trackedBeachTime);
	}
	let lastTrackedBeachTime: iso.Batch.BeachTimeRange | null = null;

	// Good requirements
	let firstGoodTide: iso.Batch.BeachTimeTideMark | null = null;
	let firstGoodSun: iso.Astro.BodyEvent | null = null;
	let firstGoodWeather: iso.Weather.Hourly | iso.Weather.Day | null = null;
	let mostRecentGoodWeather: iso.Weather.Hourly | iso.Weather.Day | null = null;
	// Bad requirements
	let lastBadTide: iso.Batch.BeachTimeTideMark | null = null;
	let lastBadSun: iso.Astro.BodyEvent | null = null;
	let lastBadWeather: iso.Weather.Hourly | iso.Weather.Day | null = null;

	reasons.forEach((reason) => {
		const time = reason.time;
		// if (time < referenceTime) {
		// 	// For beach time, not all data is available before the reference time.
		// 	// So just ignore.
		// 	return;
		// }

		// It's only one of these. The others will be null.
		const tideMark = isBeachTimeTideMark(reason) ? reason : null;
		const sunEvent = isSunEvent(reason) ? reason : null;
		const weatherEntry = isWeatherEntry(reason) ? reason : null;

		const weatherIdeal = weatherEntry ? getWeatherIdeal(weatherEntry) : null;
		const isWeatherBest = weatherIdeal === WeatherIdeal.best;
		/*
			Scenarios:
			- It's beach time
				- Good reason
					- Update weather block
				- Bad reason
					- End weather block
					- Add bad reason to stop reasons
					- Clear last good reason for that type
			- It's not beach time
				- Good reason
					- Set last good reason for type only if not currently set
					- Do NOT clear last bad reason
					- Check for start beach time
						- If starting, clear all last bad reasons
				- Bad reason
					- Clear last good reason for that type
					- If no last bad reason, add to stop reasons for last beach time
					- Then, set last bad reason
		*/

		// Here, "Bad" means "Reason to end a range" and "Good" means "Reason to start a range"
		const isTideReasonGood = !!tideMark && !tideMark.isRising;
		const isSunReasonGood = !!sunEvent && sunEvent.isRise;
		const isWeatherReasonGood = !!weatherEntry && (weatherIdeal === WeatherIdeal.best || weatherIdeal === WeatherIdeal.okay);
		const isAnyReasonGood = isTideReasonGood || isSunReasonGood || isWeatherReasonGood;

		if (isWeatherReasonGood) {
			mostRecentGoodWeather = weatherEntry;
		}

		const isTideReasonBad = !!tideMark && tideMark.isRising;
		const isSunReasonBad = !!sunEvent && !sunEvent.isRise;
		const isWeatherReasonBad = !!weather && (weatherIdeal === WeatherIdeal.bad);
		const isAnyReasonBad = isTideReasonBad || isSunReasonBad || isWeatherReasonBad;

		if (trackedBeachTime != null) {
			// If in beach time...

			if (isAnyReasonGood) {
				// If any reason is good...

				// Update weather block if how ideal the weather is has changed
				if (isWeatherReasonGood && trackedWeatherBlock && (trackedWeatherBlock.isBest !== isWeatherBest)) {
					trackedWeatherBlock.stop = time;
					trackedWeatherBlock = {
						isBest: isWeatherBest,
						start: time,
						stop: null!
					};
					trackedBeachTime.weather.push(trackedWeatherBlock);
				}
			}
			else if (isAnyReasonBad) {
				// If any reason is bad...

				if (isTideReasonBad) {
					firstGoodTide = null;
					lastBadTide = tideMark;
				}
				else if (isSunReasonBad) {
					firstGoodSun = null;
					lastBadSun = sunEvent;
				}
				else if (isWeatherReasonBad) {
					firstGoodWeather = null;
					lastBadWeather = weatherEntry;
				}

				if (trackedWeatherBlock) {
					trackedWeatherBlock.stop = time;
					trackedWeatherBlock = null;
				}
				trackedBeachTime.stopReasons.push(reason);
				trackedBeachTime.stop = time;
				lastTrackedBeachTime = trackedBeachTime;
				trackedBeachTime = null;
			}

		}
		else {
			// If not in beach time...

			if (isAnyReasonGood) {
				// If any reason is good...

				if (isTideReasonGood && !firstGoodTide) {
					firstGoodTide = tideMark;
				}
				else if (isSunReasonGood && !firstGoodSun) {
					firstGoodSun = sunEvent;
				}
				else if (isWeatherReasonGood && !firstGoodWeather) {
					firstGoodWeather = weatherEntry;
				}

				if (firstGoodTide != null && firstGoodSun != null && firstGoodWeather != null) {
					// Start beach time
					trackedWeatherBlock = {
						// Either rely on this entry that's starting the beach time, or the last one we have saved.
						isBest: getWeatherIdeal(mostRecentGoodWeather!) === WeatherIdeal.best,
						start: time,
						stop: null!
					};
					trackedBeachTime = {
						start: time,
						startReasons: [firstGoodTide, firstGoodSun, firstGoodWeather],
						stop: null!,
						stopReasons: [],
						weather: [trackedWeatherBlock]
					};
					allBeachTimes.push(trackedBeachTime);

					lastBadTide = null;
					lastBadWeather = null;
					lastBadSun = null;
				}
			}
			else if (isAnyReasonBad) {
				// If any reason is bad...

				if (isTideReasonBad) {
					firstGoodTide = null;
					if (!lastBadTide && lastTrackedBeachTime) {
						lastTrackedBeachTime.stopReasons.push(tideMark);
					}
					lastBadTide = tideMark;
				}
				else if (isSunReasonBad) {
					firstGoodSun = null;
					if (!lastBadSun && lastTrackedBeachTime) {
						lastTrackedBeachTime.stopReasons.push(sunEvent);
					}
					lastBadSun = sunEvent;
				}
				else if (isWeatherReasonBad) {
					firstGoodWeather = null;
					if (!lastBadWeather && lastTrackedBeachTime) {
						lastTrackedBeachTime.stopReasons.push(weatherEntry!);
					}
					lastBadWeather = weatherEntry;
				}
			}

		}
	});

	// Cleanup:
	// Ensure no stop times are still null
	if (trackedBeachTime) {
		allBeachTimes.pop();
	}

	const daysMap = new Map<number, iso.Batch.BeachTimeDay>();
	function getFor(time: DateTime): iso.Batch.BeachTimeDay {
		const startOfDay = time.startOf('day');
		const key = startOfDay.toMillis();
		if (!daysMap.get(key)) {
			daysMap.set(key, {
				day: startOfDay,
				astro: null!,
				ranges: [],
				weather: null!
			});
		}
		return daysMap.get(key)!;
	}
	weather.daily.forEach((day) => {
		const beachTimeDay = getFor(day.time);
		beachTimeDay.weather = day;
	});
	astro.daily.forEach((day) => {
		const beachTimeDay = getFor(day.rise);
		beachTimeDay.astro = { sun: day, moon: null! };
	});
	weather.moonPhaseDaily.forEach((day) => {
		const beachTimeDay = getFor(day.time);
		beachTimeDay.astro.moon = day.moon;
	});
	allBeachTimes.forEach((range) => {
		const beachTimeDay = getFor(range.start);
		beachTimeDay.ranges.push(range);
	});

	return {
		current: currentBeachTime,
		next: currentBeachTime ? allBeachTimes[1] : allBeachTimes[0],
		days: Array.from(daysMap.values())
	};
}

function isBeachTimeTideMark(value: iso.Batch.BeachTimeReason): value is iso.Batch.BeachTimeTideMark {
	return !!value && (value as iso.Batch.BeachTimeTideMark).isRising !== undefined;
}
function isSunEvent(value: iso.Batch.BeachTimeReason): value is iso.Astro.BodyEvent {
	return !!value && (value as iso.Astro.BodyEvent).isRise !== undefined;
}
function isWeatherEntry(value: iso.Batch.BeachTimeReason): value is iso.Weather.Hourly | iso.Weather.Day {
	return !!value && (value as iso.Weather.Hourly | iso.Weather.Day).status !== undefined;
}


/** Return all the points in time where we cross our beach access height. */
function getBeachTideMarks(tide: FetchedTide): iso.Batch.BeachTimeTideMark[] {
	const { beachAccessHeight } = iso.constant;
	const { extrema } = tide;

	/*
		We know we will hit this point in time at most one time between each extrema, because we will be assuming
		that we'll never go outside the predicted tide extremes.
	*/

	const tideMarks: iso.Batch.BeachTimeTideMark[] = [];
	for (let i = 0; i < extrema.length; i++) {
		if (i === extrema.length - 1) {
			break;
		}

		const mark = getEstimationOfBeachMark(beachAccessHeight, extrema[i], extrema[i + 1]);
		if (mark != null) {
			tideMarks.push(mark);
		}
	}
	return tideMarks;
}

function getEstimationOfBeachMark(beachAccessHeight: number, a: iso.Tide.ExtremeStamp, b: iso.Tide.ExtremeStamp): iso.Batch.BeachTimeTideMark | null {
	/*
		Use arccosine function, where our domain is [-1, 1] and range is [0, pi]
		So translate our beach height into that domain, and then map the result back out to the time between.
		(See https://www.math.net/arccos)
	*/

	let [low, high] = [a.height, b.height];
	const isStartLow = a.isLow;
	if (!isStartLow) {
		[low, high] = [high, low];
	}

	let beachAccessHeightAsPercent = (beachAccessHeight - low) / (high - low); // Get to [0, 1]
	if (isStartLow) {
		// If we started low, we need to flip at some point. Do it here while we understand our domain
		beachAccessHeightAsPercent = 1 - beachAccessHeightAsPercent;
	}
	if (beachAccessHeightAsPercent > 1 || beachAccessHeightAsPercent < 0) {
		// This is that not-gonna-happen case where the beach access height is above the high or below the low.
		return null;
	}

	const beachAccessHeightInDomain = (beachAccessHeightAsPercent * 2) - 1; // Get to [-1, 1]

	const radian = Math.acos(beachAccessHeightInDomain);
	const radianAsPercent = radian / Math.PI; // Get to [0, 1]
	const secondsRange = b.time.diff(a.time, 'seconds').seconds;
	const secondsFromA = radianAsPercent * secondsRange;
	const time = a.time.plus({ seconds: secondsFromA });

	return {
		isRising: isStartLow,
		time
	};
}

/**
 * Hourly weather only goes to 48 hours out.
 * Daily weather goes 7 days.
 * We should get as much as we can from hourly, and use daily for the remainder.
*/
function getCombinedWeather(hourly: iso.Weather.Hourly[], daily: iso.Weather.Day[]): (iso.Weather.Hourly | iso.Weather.Day)[] {
	/*
		Get the last hourly and use its time as the start of the daily for that day (rewrite that entry).
		Discard all dailies before then.
	*/
	const lastHourly = hourly.at(-1)!;
	const allOtherHourly = hourly.slice(0, hourly.length - 1);
	const combined: (iso.Weather.Hourly | iso.Weather.Day)[] = allOtherHourly;
	// Filter days to only those in the same day or later than this last hour.
	const [firstFilteredDay, ...otherFilteredDays] = daily.filter((day) => {
		return day.time >= lastHourly.time;
	});
	// Rewrite that first day to use the last hour's time and cover the rest of the day.
	const bridgeDaySpan: iso.Weather.Day = {
		...firstFilteredDay,
		time: lastHourly.time,
	};
	combined.push(bridgeDaySpan, ...otherFilteredDays);
	return combined;
}

enum WeatherIdeal {
	bad,
	okay,
	best
}

/** The best possible ideal that can be assigned to a weather status. */
const weatherStatusIdeal: Record<keyof typeof iso.Weather.StatusType, WeatherIdeal> = {
	clear: WeatherIdeal.best,
	clear_hot: WeatherIdeal.best,
	clear_cold: WeatherIdeal.best,
	clouds_few: WeatherIdeal.best,
	clouds_some: WeatherIdeal.best,
	clouds_most: WeatherIdeal.best,

	dust: WeatherIdeal.okay,
	smoke: WeatherIdeal.okay,
	unknown: WeatherIdeal.okay,
	clouds_over: WeatherIdeal.okay,
	rain_drizzle: WeatherIdeal.okay,
	rain_light: WeatherIdeal.okay,
	haze: WeatherIdeal.okay,
	fog: WeatherIdeal.okay,

	thun_light: WeatherIdeal.bad,
	snow_light: WeatherIdeal.bad,
	rain_medium: WeatherIdeal.bad,
	rain_heavy: WeatherIdeal.bad,
	rain_freeze: WeatherIdeal.bad,
	snow_medium: WeatherIdeal.bad,
	snow_heavy: WeatherIdeal.bad,
	snow_sleet: WeatherIdeal.bad,
	snow_rain: WeatherIdeal.bad,
	thun_medium: WeatherIdeal.bad,
	thun_heavy: WeatherIdeal.bad,
	intense_storm: WeatherIdeal.bad,
	intense_other: WeatherIdeal.bad,
};

function getWeatherIdeal(entry: iso.Weather.Current | iso.Weather.Hourly | iso.Weather.Day): WeatherIdeal {
	const { status } = entry;

	// If the best scenario is bad, just say it's bad
	const ideal = iso.mapEnumValue(iso.Weather.StatusType, weatherStatusIdeal, status);
	if (ideal === WeatherIdeal.bad) {
		return WeatherIdeal.bad;
	}

	// // If there's a good chance of rain, no beach time.
	// if (pop >= .8) {
	// 	return WeatherIdeal.bad;
	// }

	return ideal;
}

