import { Info, AllResponse, errorIssue, AllResponseData, TideEvent, TideStatus, SunEvent, TideEventRange, AllDailyDay, DailyWeather } from 'tidy-shared';
import { APIConfigurationContext } from '../context';
import { interpretTides } from '../tide/tide-interpret';
import { randomizer } from './randomize';
import { DateTime } from 'luxon';
import { linearFromPoints } from './equation';
import { interpretAstro } from '../astro/astro-interpret';
import { ForDay } from '../all';
import { IntermediateWeatherValues } from '../weather/weather-intermediate';
import { interpretWeather } from '../weather/weather-interpret';

export function success(configContext: APIConfigurationContext): AllResponse {

	const [pastTideEvents, currentTideStatus, futureTideEvents] = createTideData(configContext);
	const interpretedTides = interpretTides(configContext, pastTideEvents, currentTideStatus, futureTideEvents);

	const sunEvents = createAstroData(configContext);
	const interpretedAstro = interpretAstro(configContext, sunEvents);

	const intermediateWeather = createWeatherData(configContext);
	const interpretedWeather = interpretWeather(configContext, intermediateWeather);

	const data: AllResponseData = {
		warning: null!,
		current: {
			sun: {
				previous: interpretedAstro.previousEvent,
				next: interpretedAstro.nextEvent
			},
			weather: interpretedWeather.currentWeather,
			tides: interpretedTides.currentTides
		},
		predictions: {
			cutoffDate: configContext.context.maxShortTermDataFetch.toJSDate(),
			sun: interpretedAstro.shortTermEvents,
			weather: interpretedWeather.shortTermWeather,
			tides: interpretedTides.shortTermTides
		},
		daily: {
			cutoffDate: configContext.context.maxLongTermDataFetch.toJSDate(),
			tideExtremes: interpretedTides.longTermTideExtremes,
			days: mergeForLongTerm(configContext, interpretedTides.longTermTides, interpretedAstro.longTermEvents, interpretedWeather.longTermWeather)
		}
	};

	return {
		info: createInfo(configContext),
		error: null,
		data: data
	};
}

export function failure(configContext: APIConfigurationContext): AllResponse {
	return {
		info: createInfo(configContext),
		error: {
			errors: [errorIssue('Could not fetch any data', 'Here is a dev message')]
		},
		data: null
	};
}

function createInfo(configContext: APIConfigurationContext): Info {
	return {
		referenceTime: configContext.configuration.time.referenceTime,
		processingTime: new Date(),
		tideHeightPrecision: configContext.configuration.tides.tideHeightPrecision
	}
}

function mergeForLongTerm(configContext: APIConfigurationContext, tides: ForDay<TideEventRange>[], sunEvents: ForDay<SunEvent[]>[], weatherEvents: ForDay<DailyWeather>[]): AllDailyDay[] {

	const referenceDay = configContext.context.referenceTimeInZone.startOf('day');
	const dayMap: Map<number, AllDailyDay> = new Map();

	tides.forEach((t) => {
		const day = referenceDay.plus({ days: t.day });
		dayMap.set(t.day, {
			date: day.toJSDate(),
			sun: null!,
			weather: null!,
			tides: t.entity
		});
	});
	sunEvents.forEach((s) => {
		const record = dayMap.get(s.day);
		if (record) {
			record.sun = s.entity;
		}
	});
	weatherEvents.forEach((w) => {
		const record = dayMap.get(w.day);
		if (record) {
			record.weather = w.entity;
		}
	});

	return Array.from(dayMap.values())
}

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

export function createTideData(configContext: APIConfigurationContext): [TideEvent[], TideStatus, TideEvent[]] {

	const tideRandomizer = randomizer('_tide_');

	// Get our time between highs and lows.
	// Between 5.8 hours and 6.3 hours
	const minTimeBetweenHighLowMinutes = 5.8 * 60;
	const maxTimeBetweenHighLowMinutes = 6.3 * 60;
	const tideHeightPrecision = configContext.configuration.tides.tideHeightPrecision;

	let startDateTime = configContext.context.tides.minimumTidesDataFetch;
	const endDateTime = configContext.context.maxLongTermDataFetch;

	const eventTimes: DateTime[] = [startDateTime];
	while (startDateTime < endDateTime) {
		const minutesPassed = tideRandomizer.randomInt(minTimeBetweenHighLowMinutes, maxTimeBetweenHighLowMinutes, true);
		startDateTime = startDateTime.plus({ minutes: minutesPassed });
		eventTimes.push(startDateTime);
	}

	const referenceTime = configContext.context.referenceTimeInZone;
	const startHighOrLowOffset = tideRandomizer.randomInt(0, 1, true);
	const previousEvents: TideEvent[] = [];
	const futureEvents: TideEvent[] = [];
	eventTimes.forEach((time, index) => {

		const isLow = (index + startHighOrLowOffset) % 2 === 0;
		// Low: [0, 2.5]
		// High: [6, 9]
		const height = isLow ? tideRandomizer.randomFloat(0, 2.5, tideHeightPrecision, true) : tideRandomizer.randomFloat(6, 9, tideHeightPrecision, true);

		const event: TideEvent = {
			time: time.toJSDate(),
			isLow: isLow,
			height: height
		};

		if (time < referenceTime) {
			previousEvents.push(event);
		}
		else if (time >= referenceTime) {
			futureEvents.push(event);
		}
	});

	// Do an estimation of the current height based on previous and next.
	const previousEvent = previousEvents[previousEvents.length - 1];
	const timeOfPrevious = DateTime.fromJSDate(previousEvent.time, { zone: configContext.configuration.location.timeZoneLabel });
	const nextEvent = futureEvents[0];
	const timeOfNext = DateTime.fromJSDate(nextEvent.time, { zone: configContext.configuration.location.timeZoneLabel });
	const minutesBetweenReferenceAndPrevious = Math.max(0, referenceTime.diff(timeOfPrevious, 'minutes').minutes);
	const minutesBetweenNextAndPrevious = timeOfNext.diff(timeOfPrevious, 'minutes').minutes;

	const percentFromPreviousToNext = minutesBetweenReferenceAndPrevious / minutesBetweenNextAndPrevious;
	const height = (percentFromPreviousToNext * (nextEvent.height - previousEvent.height)) + previousEvent.height;
	const heightWithPrecision = parseFloat(height.toFixed(tideHeightPrecision));

	const currentStatus: TideStatus = {
		time: referenceTime.toJSDate(),
		height: heightWithPrecision
	};

	return [previousEvents, currentStatus, futureEvents];
}

export function createAstroData(configContext: APIConfigurationContext): SunEvent[] {
	const sunRandomizer = randomizer('_sun_');

	let startDateTime = configContext.context.astro.minimumSunDataFetch;
	const endDateTime = configContext.context.maxLongTermDataFetch;
	// Add 2 to our days so we get sunrise and sunset on the end day (which was the start of that day).
	const daysBetween = endDateTime.diff(startDateTime, 'days').days + 2;

	// sunrise (function) - ([5:30,7] to [5:30,7]) - linear
	const minSunriseMinutes = 5.5 * 60;
	const maxSunriseMinutes = 7 * 60;
	const startingSunriseMinutes = sunRandomizer.randomInt(minSunriseMinutes, maxSunriseMinutes, true);
	const endingSunriseMinutes = sunRandomizer.randomInt(minSunriseMinutes, maxSunriseMinutes, true);

	const sunriseMinutesFunc = linearFromPoints([0, startingSunriseMinutes], [daysBetween, endingSunriseMinutes]);
	const sunriseMinutes: number[] = [];
	for (let i = 0; i < daysBetween; i++) {
		sunriseMinutes.push(Math.floor(sunriseMinutesFunc(i)));
	}

	// sunset (function) - ([18,19] to [18,19]) - linear
	const minSunsetMinutes = 18 * 60;
	const maxSunsetMinutes = 19 * 60;
	const startingSunsetMinutes = sunRandomizer.randomInt(minSunsetMinutes, maxSunsetMinutes, true);
	const endingSunsetMinutes = sunRandomizer.randomInt(minSunsetMinutes, maxSunsetMinutes, true);

	const sunsetMinutesFunc = linearFromPoints([0, startingSunsetMinutes], [daysBetween, endingSunsetMinutes]);
	const sunsetMinutes: number[] = [];
	for (let i = 0; i < daysBetween; i++) {
		sunsetMinutes.push(Math.floor(sunsetMinutesFunc(i)));
	}

	// Combine our events
	const sunEvents: SunEvent[] = [];
	for (let i = 0; i < daysBetween; i++) {
		const day = startDateTime.plus({ days: i });
		sunEvents.push({
			time: day.plus({ minutes: sunriseMinutes[i] }).toJSDate(),
			isSunrise: true,
		});
		sunEvents.push({
			time: day.plus({ minutes: sunsetMinutes[i] }).toJSDate(),
			isSunrise: false,
		});
	}

	return sunEvents;
}

export function createWeatherData(configContext: APIConfigurationContext): IntermediateWeatherValues {
	return configContext && null!;
}


// weather time (function) - always 3 apart
// weather type (function) - polynomial 
// weather temp (function) - polynomial
// weather precip (function) - polynomial
// weather wind (function) - polynomial
// weather wind direction (function) - polynomial