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
	let moonPhaseDay: iso.Astro.MoonPhaseDay | null = weather.moonPhaseDaily[moonDayIndex];
	let currentDay: iso.Batch.TideContentDay = {
		extremes: [],
		moonPhase: moonPhaseDay.moon
	};
	days.push(currentDay);
	extrema.forEach((extreme) => {
		if (!moonPhaseDay || extreme.time < moonPhaseDay.time.startOf('day')) {
			// Ignore if before our day (to cover past tide data against moon data)
		}
		else if (moonPhaseDay.time.hasSame(extreme.time, 'day')) {
			currentDay.extremes.push(extreme);
		}
		else {
			moonDayIndex++;
			moonPhaseDay = weather.moonPhaseDaily[moonDayIndex];
			if (moonPhaseDay) {
				currentDay = {
					extremes: [extreme],
					moonPhase: moonPhaseDay.moon
				};
				days.push(currentDay);
			}
		}
	});
	return days;
}

export function getBeachContent(config: BaseConfig, tide: FetchedTide, dailyTides: iso.Batch.TideContentDay[], astro: ComputedAstro, weather: FetchedWeather): iso.Batch.BeachContent {
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
	let isCurrentDaylight = false;
	for (let i = 0; i < astro.daily.length; i++) {
		const astroDaily = astro.daily[i];
		if (referenceTime.hasSame(astroDaily.rise, 'day')) {
			if (referenceTime >= astroDaily.rise && referenceTime <= astroDaily.set) {
				isCurrentDaylight = true;
				break;
			}
			if (referenceTime > astroDaily.set) {
				break;
			}
		}
	}
	const isStartingInBeachTime = isTideCurrentlyGood && weather.current.indicator !== iso.Weather.Indicator.bad && isCurrentDaylight;

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

	let firstCurrentStopReason: iso.Batch.BeachTimeReason | null = null;
	let upcomingNextStartReasons: iso.Batch.BeachTimeReason[] = [];

	let trackedWeatherBlock: iso.Batch.BeachTimeWeatherBlock | null = isStartingInBeachTime ? {
		indicator: weather.current.indicator,
		start: referenceTime,
		stop: null!
	} : null;
	let trackedBeachTime: iso.Batch.BeachTimeRange | null = isStartingInBeachTime ? {
		start: referenceTime,
		stop: null!,
		weather: [trackedWeatherBlock!]
	} : null;
	let currentBeachTime: iso.Batch.BeachTimeRange | null = trackedBeachTime;
	let allBeachTimes: iso.Batch.BeachTimeRange[] = [];
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
	// let lastBadTide: iso.Batch.BeachTimeTideMark | null = null;
	// let lastBadSun: iso.Astro.BodyEvent | null = null;
	// let lastBadWeather: iso.Weather.Hourly | iso.Weather.Day | null = null;

	reasons.forEach((reason) => {
		const time = reason.time;
		/*
			We don't have a lot of good, consistent data before our reference time. This can create weird 
			beach time scenarios.
			If we are in a beach time at the start, we don't need to know anything else about the past.
			But if we aren't, those past times could be valuable start reasons.
		*/
		if (isStartingInBeachTime && time < referenceTime) {
			return;
		}

		// It's only one of these. The others will be null.
		const tideMark = iso.Batch.isBeachTimeTideMark(reason) ? reason : null;
		const sunEvent = iso.Batch.isSunEvent(reason) ? reason : null;
		const weatherEntry = iso.Batch.isWeatherEntry(reason) ? reason : null;
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
		const isWeatherReasonGood = !!weatherEntry && (weatherEntry.indicator !== iso.Weather.Indicator.bad);
		const isAnyReasonGood = isTideReasonGood || isSunReasonGood || isWeatherReasonGood;

		if (isWeatherReasonGood) {
			mostRecentGoodWeather = weatherEntry;
		}

		const isTideReasonBad = !!tideMark && tideMark.isRising;
		const isSunReasonBad = !!sunEvent && !sunEvent.isRise;
		const isWeatherReasonBad = !!weatherEntry && (weatherEntry.indicator === iso.Weather.Indicator.bad);
		const isAnyReasonBad = isTideReasonBad || isSunReasonBad || isWeatherReasonBad;

		if (trackedBeachTime != null) {
			// If in beach time...

			if (isAnyReasonGood) {
				// If any reason is good...

				// Update weather block if how ideal the weather is has changed
				if (isWeatherReasonGood && trackedWeatherBlock && (trackedWeatherBlock.indicator !== weatherEntry!.indicator)) {
					trackedWeatherBlock.stop = time;
					trackedWeatherBlock = {
						indicator: weatherEntry!.indicator,
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
					// lastBadTide = tideMark;
				}
				else if (isSunReasonBad) {
					firstGoodSun = null;
					// lastBadSun = sunEvent;
				}
				else if (isWeatherReasonBad) {
					firstGoodWeather = null;
					// lastBadWeather = weatherEntry;
				}

				if (trackedWeatherBlock) {
					trackedWeatherBlock.stop = time;
					trackedWeatherBlock = null;
				}
				if (trackedBeachTime === currentBeachTime) {
					/*
						If we're tracking the current beach time,
						keep track of the reason it's stopping.
					*/
					firstCurrentStopReason = reason;
				}
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
						indicator: mostRecentGoodWeather!.indicator,
						start: time,
						stop: null!
					};
					trackedBeachTime = {
						start: time,
						stop: null!,
						weather: [trackedWeatherBlock]
					};
					allBeachTimes.push(trackedBeachTime);

					if (!currentBeachTime && !lastTrackedBeachTime) {
						/*
							If we don't have a current beach time and we don't have a last tracked beach time,
							this is the first one, or 'next'.
							Track the start reasons that will happen in the future to create this beach time.
						*/
						const startReasons: iso.Batch.BeachTimeReason[] = [firstGoodTide, firstGoodSun, firstGoodWeather];
						upcomingNextStartReasons = startReasons.filter((reason) => {
							return reason.time > referenceTime;
						});
					}

					// lastBadTide = null;
					// lastBadWeather = null;
					// lastBadSun = null;
				}
			}
			else if (isAnyReasonBad) {
				// If any reason is bad...

				if (isTideReasonBad) {
					firstGoodTide = null;
					// if (!lastBadTide && lastTrackedBeachTime) {
					// 	lastTrackedBeachTime.stopReasons.push(tideMark);
					// }
					// lastBadTide = tideMark;
				}
				else if (isSunReasonBad) {
					firstGoodSun = null;
					// if (!lastBadSun && lastTrackedBeachTime) {
					// 	lastTrackedBeachTime.stopReasons.push(sunEvent);
					// }
					// lastBadSun = sunEvent;
				}
				else if (isWeatherReasonBad) {
					firstGoodWeather = null;
					// if (!lastBadWeather && lastTrackedBeachTime) {
					// 	lastTrackedBeachTime.stopReasons.push(weatherEntry!);
					// }
					// lastBadWeather = weatherEntry;
				}
			}

		}
	});

	// Cleanup:
	// Ensure no stop times are still null
	if (trackedBeachTime) {
		allBeachTimes.pop();
	}
	// Remove any beach times that are less than 30 minutes long
	allBeachTimes = allBeachTimes.filter((beachTime) => {
		return beachTime.stop && beachTime.start && beachTime.stop.diff(beachTime.start, 'minutes').minutes >= 30;
	});
	// Remove current beach time if it is less than 30 minutes long
	if (currentBeachTime && currentBeachTime.stop && currentBeachTime.start && currentBeachTime.stop.diff(currentBeachTime.start, 'minutes').minutes < 30) {
		currentBeachTime = null;
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
				tideLows: [],
				tideMarks: [],
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
	tideMarks.forEach((tideMark) => {
		const beachTimeDay = getFor(tideMark.time);
		beachTimeDay.tideMarks.push(tideMark);
	});
	dailyTides.forEach((day) => {
		const justLows = day.extremes.filter((extreme) => extreme.isLow);
		if (justLows.length) {
			const first = justLows[0];
			const beachTimeDay = getFor(first.time);
			beachTimeDay.tideLows = justLows;
		}
	});
	weather.moonPhaseDaily.forEach((day) => {
		const beachTimeDay = getFor(day.time);
		if (beachTimeDay.astro) {
			beachTimeDay.astro.moon = day.moon;
		}
	});
	allBeachTimes.forEach((range) => {
		const beachTimeDay = getFor(range.start);
		beachTimeDay.ranges.push(range);
	});
	// Strip out anything incomplete.
	Array.from(daysMap.keys()).forEach((key) => {
		const beachTimeDay = daysMap.get(key);
		if (!beachTimeDay || !beachTimeDay.astro || !beachTimeDay.weather || beachTimeDay.astro.moon === null) {
			daysMap.delete(key);
		}
	});

	return {
		firstCurrentStopReason,
		upcomingNextStartReasons,
		current: currentBeachTime,
		next: currentBeachTime ? allBeachTimes[1] : allBeachTimes[0],
		days: Array.from(daysMap.values())
	};
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




