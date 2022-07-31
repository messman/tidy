import { DateTime, DurationLikeObject } from 'luxon';
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

export function getBeachContent(config: BaseConfig, tide: FetchedTide, tideMeasured: iso.Tide.MeasureStamp, dailyTides: iso.Batch.TideContentDay[], astro: ComputedAstro, weather: FetchedWeather): iso.Batch.BeachContent {
	const { referenceTime } = config;

	/*
		Go through one long list of all the "events" in order. Sort of like if you had them all in front of you
		on a paper and you moved your finger across until you saw all things aligned.

		What we're looking for:
		- When the tide allows us on the beach
		- When it's daylight
		- When the weather is good

		But with each of those requirements, there's three states: best, okay, and bad.

		Also, our "current" beach time is a special case. We have no idea when it started, because weather
		data doesn't go back that far. We have to figure out our current status and call that the start.
	*/

	const { beachAccessEarlyRise, beachAccessEarlyFall, beachAccessFullyRise, beachAccessFullyFall, sunLightBufferMinutes } = iso.constant;

	// First, use the current data (more accurate) to know whether it's beach time currently.
	let currentTideMarkStatus: iso.Batch.BeachTimeTideMarkStatus = null!;
	if (tideMeasured.direction === iso.Tide.Direction.rising || (tideMeasured.direction === iso.Tide.Direction.turning && tideMeasured.division === iso.Tide.Division.high)) {
		// High or rising
		if (tideMeasured.height > beachAccessFullyRise) {
			currentTideMarkStatus = iso.Batch.BeachTimeTideMarkStatus.fullyRise;
		}
		else if (tideMeasured.height > beachAccessEarlyRise) {
			currentTideMarkStatus = iso.Batch.BeachTimeTideMarkStatus.earlyRise;
		}
		else {
			currentTideMarkStatus = iso.Batch.BeachTimeTideMarkStatus.fullyFall;
		}
	}
	else {
		// Low or falling
		if (tideMeasured.height > beachAccessEarlyFall) {
			currentTideMarkStatus = iso.Batch.BeachTimeTideMarkStatus.fullyRise;
		}
		else if (tideMeasured.height > beachAccessFullyFall) {
			currentTideMarkStatus = iso.Batch.BeachTimeTideMarkStatus.earlyFall;
		}
		else {
			currentTideMarkStatus = iso.Batch.BeachTimeTideMarkStatus.fullyFall;
		}
	}

	let currentSunMarkStatus: iso.Batch.BeachTimeSunMarkStatus = iso.Batch.BeachTimeSunMarkStatus.night;
	for (let i = 0; i < astro.daily.length; i++) {
		const astroDaily = astro.daily[i];
		if (referenceTime.hasSame(astroDaily.rise, 'day')) {
			if (referenceTime < astroDaily.rise.minus({ minutes: sunLightBufferMinutes })) {
				currentSunMarkStatus = iso.Batch.BeachTimeSunMarkStatus.night;
			}
			else if (referenceTime < astroDaily.rise) {
				currentSunMarkStatus = iso.Batch.BeachTimeSunMarkStatus.predawn;
			}
			else if (referenceTime < astroDaily.set) {
				currentSunMarkStatus = iso.Batch.BeachTimeSunMarkStatus.sunrise;
			}
			else if (referenceTime < astroDaily.set.plus({ minutes: sunLightBufferMinutes })) {
				currentSunMarkStatus = iso.Batch.BeachTimeSunMarkStatus.sunset;
			}
			else {
				currentSunMarkStatus = iso.Batch.BeachTimeSunMarkStatus.night;
			}
		}
	}

	const currentTideBeachStatus = getStatusForTideMarkStatus(currentTideMarkStatus);
	const currentSunBeachStatus = getStatusForSunMarkStatus(currentSunMarkStatus);
	const currentWeatherBeachStatus = getStatusForWeatherIndicator(weather.current.indicator);
	let currentBeachStatus = getBeachTimeStatusFromParts(currentTideBeachStatus, currentSunBeachStatus, currentWeatherBeachStatus);
	const isStartingInBeachTime = currentBeachStatus !== iso.Batch.BeachTimeStatus.not;

	const currentTide: iso.Batch.BeachTimeCurrentTide = {
		beachTimeStatus: currentTideBeachStatus,
		tideMarkStatus: currentTideMarkStatus
	};
	const currentSun: iso.Batch.BeachTimeCurrentSun = {
		beachTimeStatus: currentSunBeachStatus,
		sunMarkStatus: currentSunMarkStatus
	};
	const currentWeather: iso.Batch.BeachTimeCurrentWeather = {
		beachTimeStatus: currentWeatherBeachStatus,
		weatherMarkStatus: weather.current.indicator
	};

	const tideMarks = getTideMarks(tide);
	const sunMarks = getSunMarks(astro.daily);
	const weatherMarks = getWeatherMarks(weather.hourly, weather.daily);

	/*
		This sorting could be made more efficient with a merge implementation, but it's not a major issue.
	*/
	const reasons: iso.Batch.BeachTimeReason[] = [...tideMarks, ...sunMarks, ...weatherMarks];
	reasons.sort((a, b) => {
		return a.time.toMillis() - b.time.toMillis();
	});

	let firstCurrentStopReason: iso.Batch.BeachTimeReason | null = null;

	let trackedBlock: iso.Batch.BeachTimeBlock | null = isStartingInBeachTime ? {
		isBest: currentBeachStatus === iso.Batch.BeachTimeStatus.best,
		start: referenceTime,
		stop: null!
	} : null;
	let trackedBeachTime: iso.Batch.BeachTimeRange | null = isStartingInBeachTime ? {
		start: referenceTime,
		stop: null!,
		blocks: [trackedBlock!]
	} : null;
	let currentBeachTime: iso.Batch.BeachTimeRange | null = trackedBeachTime;
	let allBeachTimes: iso.Batch.BeachTimeRange[] = [];
	if (trackedBeachTime) {
		allBeachTimes.push(trackedBeachTime);
	}

	let mostRecentTideStatus: iso.Batch.BeachTimeStatus = currentTideBeachStatus;
	let mostRecentSunStatus: iso.Batch.BeachTimeStatus = currentSunBeachStatus;
	let mostRecentWeatherStatus: iso.Batch.BeachTimeStatus = currentWeatherBeachStatus;


	reasons.forEach((reason) => {
		const time = reason.time;
		/*
			We don't have a lot of good, consistent data before our reference time. This can create weird 
			beach time scenarios.
			Disregard everything that happens before our reference time.
		*/
		if (time < referenceTime) {
			return;
		}

		// It's only one of these. The others will be null.
		const tideMark = iso.Batch.isBeachTimeTideMark(reason) ? reason : null;
		const sunMark = iso.Batch.isBeachTimeSunMark(reason) ? reason : null;
		const weatherMark = iso.Batch.isBeachTimeWeatherMark(reason) ? reason : null;

		if (tideMark) {
			mostRecentTideStatus = getStatusForTideMarkStatus(tideMark.heightStatus);
		}
		else if (sunMark) {
			mostRecentSunStatus = getStatusForSunMarkStatus(sunMark.lightStatus);
		}
		else if (weatherMark) {
			mostRecentWeatherStatus = getStatusForWeatherIndicator(weatherMark.weatherStatus);
		}

		const newBeachTimeStatus: iso.Batch.BeachTimeStatus = getBeachTimeStatusFromParts(mostRecentTideStatus, mostRecentSunStatus, mostRecentWeatherStatus);

		if (trackedBeachTime != null) {
			// If in beach time...

			if (newBeachTimeStatus !== iso.Batch.BeachTimeStatus.not) {
				// If any reason is good...

				// Create a new block if we switched on whether or not the block is best
				if (trackedBlock && trackedBlock.isBest !== (newBeachTimeStatus === iso.Batch.BeachTimeStatus.best)) {
					trackedBlock.stop = time;
					trackedBlock = {
						isBest: !trackedBlock.isBest,
						start: time,
						stop: null!
					};
					trackedBeachTime.blocks.push(trackedBlock);
				}
			}
			else if (newBeachTimeStatus === iso.Batch.BeachTimeStatus.not) {
				// If any reason is bad...

				if (trackedBlock) {
					trackedBlock.stop = time;
					trackedBlock = null;
				}
				if (trackedBeachTime === currentBeachTime) {
					/*
						If we're tracking the current beach time,
						keep track of the reason it's stopping.
					*/
					firstCurrentStopReason = reason;
				}
				trackedBeachTime.stop = time;
				//lastTrackedBeachTime = trackedBeachTime;
				trackedBeachTime = null;
			}
		}
		else {
			// If not in beach time...

			if (newBeachTimeStatus !== iso.Batch.BeachTimeStatus.not) {
				// If any reason is good...

				// Start beach time
				trackedBlock = {
					// Either rely on this entry that's starting the beach time, or the last one we have saved.
					isBest: newBeachTimeStatus === iso.Batch.BeachTimeStatus.best,
					start: time,
					stop: null!
				};
				trackedBeachTime = {
					start: time,
					stop: null!,
					blocks: [trackedBlock]
				};
				allBeachTimes.push(trackedBeachTime);
			}
		}
	});

	// Cleanup:
	// Ensure no stop times are still null
	if (trackedBeachTime) {
		allBeachTimes.pop();
	}

	// Remove any beach times that are less than 30 minutes long, excluding our current beach time
	allBeachTimes = allBeachTimes.filter((beachTime) => {
		return (beachTime === currentBeachTime) || (beachTime.stop && beachTime.start && beachTime.stop.diff(beachTime.start, 'minutes').minutes >= 30);
	});

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
		status: currentBeachStatus,
		firstStopReason: firstCurrentStopReason,
		tide: currentTide,
		sun: currentSun,
		weather: currentWeather,
		next: currentBeachTime ? allBeachTimes[1] : allBeachTimes[0],
		days: Array.from(daysMap.values())
	};
}

function getStatusForTideMarkStatus(status: iso.Batch.BeachTimeTideMarkStatus): iso.Batch.BeachTimeStatus {
	if (status === iso.Batch.BeachTimeTideMarkStatus.fullyRise) {
		return iso.Batch.BeachTimeStatus.not;
	}
	if (status === iso.Batch.BeachTimeTideMarkStatus.fullyFall) {
		return iso.Batch.BeachTimeStatus.best;
	}
	return iso.Batch.BeachTimeStatus.okay;
}

function getStatusForSunMarkStatus(status: iso.Batch.BeachTimeSunMarkStatus): iso.Batch.BeachTimeStatus {
	if (status === iso.Batch.BeachTimeSunMarkStatus.night) {
		return iso.Batch.BeachTimeStatus.not;
	}
	if (status === iso.Batch.BeachTimeSunMarkStatus.sunrise) {
		return iso.Batch.BeachTimeStatus.best;
	}
	return iso.Batch.BeachTimeStatus.okay;
}

function getStatusForWeatherIndicator(status: iso.Weather.Indicator): iso.Batch.BeachTimeStatus {
	if (status === iso.Weather.Indicator.bad) {
		return iso.Batch.BeachTimeStatus.not;
	}
	if (status === iso.Weather.Indicator.best) {
		return iso.Batch.BeachTimeStatus.best;
	}
	return iso.Batch.BeachTimeStatus.okay;
}

function getBeachTimeStatusFromParts(tideStatus: iso.Batch.BeachTimeStatus, sunStatus: iso.Batch.BeachTimeStatus, weatherStatus: iso.Batch.BeachTimeStatus): iso.Batch.BeachTimeStatus {
	let beachTimeStatus = iso.Batch.BeachTimeStatus.not;
	if (tideStatus !== iso.Batch.BeachTimeStatus.not && sunStatus !== iso.Batch.BeachTimeStatus.not && weatherStatus !== iso.Batch.BeachTimeStatus.not) {
		beachTimeStatus = iso.Batch.BeachTimeStatus.okay;

		if (tideStatus === iso.Batch.BeachTimeStatus.best && sunStatus === iso.Batch.BeachTimeStatus.best && weatherStatus === iso.Batch.BeachTimeStatus.best) {
			beachTimeStatus = iso.Batch.BeachTimeStatus.best;
		}
	}
	return beachTimeStatus;
}

/** Return all the points in time where we cross our beach access height. */
function getTideMarks(tide: FetchedTide): iso.Batch.BeachTimeTideMark[] {
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
		const marks = getTideMarksBetween(extrema[i], extrema[i + 1]);
		tideMarks.push(...marks);
	}
	return tideMarks;
}

function getTideMarksBetween(a: iso.Tide.ExtremeStamp, b: iso.Tide.ExtremeStamp): iso.Batch.BeachTimeTideMark[] {
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

	const { beachAccessEarlyFall, beachAccessEarlyRise, beachAccessFullyFall, beachAccessFullyRise } = iso.constant;
	const heightRange = (high - low);

	// Use percents to get to [0, 1].
	let firstHeightPercent = (beachAccessEarlyFall - low) / heightRange;
	let firstStatus = iso.Batch.BeachTimeTideMarkStatus.earlyFall;
	let secondHeightPercent = (beachAccessFullyFall - low) / heightRange;
	let secondStatus = iso.Batch.BeachTimeTideMarkStatus.fullyFall;

	if (isStartLow) {
		// If we started low, we need to flip at some point. Do it here while we understand our domain.
		firstHeightPercent = (beachAccessEarlyRise - low) / heightRange;
		firstHeightPercent = 1 - firstHeightPercent;
		firstStatus = iso.Batch.BeachTimeTideMarkStatus.earlyRise;
		secondHeightPercent = (beachAccessFullyRise - low) / heightRange;
		secondHeightPercent = 1 - secondHeightPercent;
		secondStatus = iso.Batch.BeachTimeTideMarkStatus.fullyRise;
	}

	const marks: iso.Batch.BeachTimeTideMark[] = [];

	// Check to ensure our constants aren't bringing us outside of the extremes (could happen with test data)
	// Will be less than zero if too low, and above one if too high.
	if (firstHeightPercent > 0 && firstHeightPercent < 1) {
		marks.push({
			time: computeTimeForTideHeight(firstHeightPercent, a.time, b.time),
			heightStatus: firstStatus
		});
	}

	if (secondHeightPercent > 0 && secondHeightPercent < 1) {
		marks.push({
			time: computeTimeForTideHeight(secondHeightPercent, a.time, b.time),
			heightStatus: secondStatus
		});
	}

	return marks;
}

function computeTimeForTideHeight(heightPercent: number, fromTime: DateTime, toTime: DateTime): DateTime {
	// Clamp
	heightPercent = Math.min(1, Math.max(0, heightPercent));

	// Number starts as [0, 1]
	const beachAccessHeightInDomain = (heightPercent * 2) - 1; // Get to [-1, 1]
	const radian = Math.acos(beachAccessHeightInDomain);
	const radianAsPercent = radian / Math.PI; // Get to [0, 1]
	const secondsRange = toTime.diff(fromTime, 'seconds').seconds;
	const secondsFrom = radianAsPercent * secondsRange;
	const time = fromTime.plus({ seconds: secondsFrom });
	return time;
}

function getSunMarks(sunDays: iso.Astro.SunDay[]): iso.Batch.BeachTimeSunMark[] {
	const bufferMinutes: DurationLikeObject = { minutes: iso.constant.sunLightBufferMinutes };
	const sunMarks: iso.Batch.BeachTimeSunMark[] = [];
	sunDays.forEach((day) => {
		sunMarks.push({
			time: day.rise.minus(bufferMinutes),
			lightStatus: iso.Batch.BeachTimeSunMarkStatus.predawn
		});
		sunMarks.push({
			time: day.rise,
			lightStatus: iso.Batch.BeachTimeSunMarkStatus.sunrise
		});
		sunMarks.push({
			time: day.set,
			lightStatus: iso.Batch.BeachTimeSunMarkStatus.sunset
		});
		sunMarks.push({
			time: day.set.plus(bufferMinutes),
			lightStatus: iso.Batch.BeachTimeSunMarkStatus.night
		});
	});
	return sunMarks;
}

/**
 * Hourly weather only goes to 48 hours out.
 * Daily weather goes 7 days.
 * We should get as much as we can from hourly, and use daily for the remainder.
*/
function getWeatherMarks(hourly: iso.Weather.Hourly[], daily: iso.Weather.Day[]): iso.Batch.BeachTimeWeatherMark[] {

	// First, discard all unneeded info for weather marks.
	const hourlyMarks = hourly.map<iso.Batch.BeachTimeWeatherMark>((hour) => {
		return {
			time: hour.time,
			weatherStatus: hour.indicator
		};
	});

	// First, discard all unneeded info for weather marks.
	const dailyMarks = daily.map<iso.Batch.BeachTimeWeatherMark>((day) => {
		return {
			time: day.time,
			weatherStatus: day.indicator
		};
	});

	/*
		Get the last hourly and use its time as the start of the daily for that day (rewrite that entry).
		Discard all dailies before then.
	*/
	const lastHourly = hourlyMarks.at(-1)!;
	const all = hourlyMarks.slice(0, hourlyMarks.length - 1);
	// Filter days to only those in the same day or later than this last hour.
	const [firstFilteredDay, ...otherFilteredDays] = dailyMarks.filter((day) => {
		return day.time >= lastHourly.time;
	});
	// Rewrite that first day to use the last hour's time and cover the rest of the day.
	const bridgeDaySpan: iso.Batch.BeachTimeWeatherMark = {
		...firstFilteredDay,
		time: lastHourly.time,
	};
	all.push(bridgeDaySpan, ...otherFilteredDays);

	return all;
}