import { DateTime } from 'luxon';
import { DailyWeather, SunEvent, TideEvent, TideStatus, warningIssue, Warnings, WeatherStatus, WeatherStatusType, WindDirection } from '@messman/wbt-iso';
import { AllMergeFunc, mergeWarnings } from '../all/all-merge';
import { APIConfigurationContext } from '../all/context';
import { IntermediateAstroValues } from '../astro/astro-intermediate';
import { interpretAstro } from '../astro/astro-interpret';
import { IntermediateTideValues } from '../tide/tide-intermediate';
import { interpretTides } from '../tide/tide-interpret';
import { IterableTimeData } from '../util/iterator';
import { RunFlags } from '../util/run-flags';
import { IntermediateWeatherValues } from '../weather/weather-intermediate';
import { interpretWeather } from '../weather/weather-interpret';
import { linearFromPoints, quadraticFromPoints } from './equation';
import { randomizer, Randomizer } from './randomize';

/** A seed value to use to get unique test data. Any falsy value will return the default random data; truthy data will make the data unique based on the truthy value. */
export type TestSeed = number | string | null;
function combineSeed(initialSeed: string, testSeed: TestSeed): string {
	return `${initialSeed}${testSeed ? testSeed : ''}`;
}

/** The main 'merge' function for our test data. Creates the fake data for each API area and combines them. */
export const allTestMerge: AllMergeFunc = async (configContext: APIConfigurationContext, runFlags: RunFlags) => {

	const tideData = createTideData(configContext, runFlags);
	//const tideData = await fetchTides(configContext);
	const interpretedTides = interpretTides(configContext, tideData);

	const astroData = createAstroData(configContext, runFlags);
	//const astroData = await fetchAstro(configContext);
	const interpretedAstro = interpretAstro(configContext, astroData);

	const weatherData = createWeatherData(configContext, runFlags);
	//const weatherData = await fetchWeather(configContext);
	const interpretedWeather = interpretWeather(configContext, weatherData);

	return {
		errors: null,
		warnings: mergeWarnings(interpretedTides.warnings, interpretedAstro.warnings, interpretedWeather.warnings),
		interpretedTides: interpretedTides,
		interpretedAstro: interpretedAstro,
		interpretedWeather: interpretedWeather
	};
};

/** Creates fake warnings to test the warnings pattern. */
function createTestWarnings(): Warnings {
	return {
		warnings: [warningIssue('This is test data.', 'This is test data.')]
	};
}

/** Creates random tide data. Uses a seeded randomizer. */
export function createTideData(configContext: APIConfigurationContext, runFlags: RunFlags): IntermediateTideValues {

	const tideRandomizer = randomizer(combineSeed('_tide_', runFlags.data.seed));

	// Get our time between highs and lows.
	// This is typically 6 hours 12 minutes and some change, but we'll make it a little random and pretend it's because of the sun.
	const minTimeBetweenHighLowMinutes = (6 * 60) + 3;
	const maxTimeBetweenHighLowMinutes = (6 * 60) + 21;
	const tideHeightPrecision = configContext.configuration.tides.tideHeightPrecision;

	let startDateTime = configContext.context.tides.minimumTidesDataFetch;
	const endDateTime = configContext.context.maxLongTermDataFetch;

	// Unlike with weather and sun, tide data shifts around all the time - it's not a predictable number of events each day or hour.
	// So we should shift the start of our events randomly as well.
	const initialMinutesPassed = tideRandomizer.randomInt(0, maxTimeBetweenHighLowMinutes, true);
	startDateTime = startDateTime.plus({ minutes: initialMinutesPassed });
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
		// Low: [0, 2]
		// High: [7, 9]
		const height = isLow ? tideRandomizer.randomFloat(0, 2, tideHeightPrecision, true) : tideRandomizer.randomFloat(7, 9, tideHeightPrecision, true);

		const event: TideEvent = {
			time: time,
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
	const timeOfPrevious = previousEvent.time;
	const nextEvent = futureEvents[0];
	const timeOfNext = nextEvent.time;
	const minutesBetweenReferenceAndPrevious = Math.max(0, referenceTime.diff(timeOfPrevious, 'minutes').minutes);
	const minutesBetweenNextAndPrevious = timeOfNext.diff(timeOfPrevious, 'minutes').minutes;

	const percentFromPreviousToNext = minutesBetweenReferenceAndPrevious / minutesBetweenNextAndPrevious;
	const height = (percentFromPreviousToNext * (nextEvent.height - previousEvent.height)) + previousEvent.height;
	const heightWithPrecision = parseFloat(height.toFixed(tideHeightPrecision));

	const currentStatus: TideStatus = {
		time: referenceTime,
		height: heightWithPrecision
	};

	return {
		errors: null,
		warnings: createTestWarnings(),
		pastEvents: previousEvents,
		current: currentStatus,
		futureEvents: futureEvents
	};
}

/** Creates random astro/sun data. Uses a seeded randomizer. */
export function createAstroData(configContext: APIConfigurationContext, runFlags: RunFlags): IntermediateAstroValues {
	const sunRandomizer = randomizer(combineSeed('_sun_', runFlags.data.seed));

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
			time: day.plus({ minutes: sunriseMinutes[i] }),
			isSunrise: true,
		});
		sunEvents.push({
			time: day.plus({ minutes: sunsetMinutes[i] }),
			isSunrise: false,
		});
	}

	return {
		errors: null,
		warnings: createTestWarnings(),
		sunEvents: sunEvents
	};
}

/** Creates random weather data. Uses a seeded randomizer. */
export function createWeatherData(configContext: APIConfigurationContext, runFlags: RunFlags): IntermediateWeatherValues {
	const weatherRandomizer = randomizer(combineSeed('_weather_', runFlags.data.seed));

	const hourlyStartDateTime = configContext.context.referenceTimeInZone.startOf('hour').minus({ hours: 1 });
	const hourlyEndDateTime = configContext.context.maxShortTermDataFetch;
	const temperaturePrecision = configContext.configuration.weather.temperaturePrecision;
	const defaultPrecision = configContext.configuration.weather.defaultPrecision;

	/*
		We use some interesting techniques here to generate more realistic random data.
		Provided some boundaries, the function below will generate a random quadratic curve function, get data
		from it, then 'shake' that data to make it a little random from data point to data point.
		Overkill? Definitely.
	*/

	function hourlyWeatherData(minY: number, maxY: number, precision: number, inclusive: boolean, shake: number): IterableTimeData<number>[] {
		return quadraticShakeData(weatherRandomizer, hourlyStartDateTime, hourlyEndDateTime, 1, minY, maxY, precision, inclusive, shake);
	}

	const nWindDirection = Object.keys(WindDirection).filter((k) => !isNaN(k as unknown as number)).length - 1;
	const nWeatherStatusType = Object.keys(WeatherStatusType).filter((k) => !isNaN(k as unknown as number)).length - 1;

	const hourly = {
		temp: hourlyWeatherData(40, 60, temperaturePrecision, true, .2),
		tempFeelsLike: hourlyWeatherData(40, 60, temperaturePrecision, true, .2),
		wind: hourlyWeatherData(0, 15, defaultPrecision, true, .2),
		windDirection: hourlyWeatherData(0, nWindDirection, 0, false, .2).map((data) => {
			return {
				span: data.span,
				value: data.value as WindDirection
			};
		}),
		pressure: hourlyWeatherData(1000, 1200, 0, true, .2),
		dewPoint: hourlyWeatherData(20, 40, temperaturePrecision, true, .2),
		cloudCover: hourlyWeatherData(0, 1, defaultPrecision + 2, true, .2),
		status: hourlyWeatherData(0, nWeatherStatusType, 0, false, .1).map((data) => {
			return {
				span: data.span,
				value: data.value as WeatherStatusType
			};
		}),
		visibility: hourlyWeatherData(2, 20, defaultPrecision, true, .2)
	};
	const shortTermWeather: WeatherStatus<DateTime, number>[] = hourly.temp.map((temp, i) => {
		return {
			time: temp.span.begin,
			temp: temp.value,
			tempFeelsLike: hourly.tempFeelsLike[i].value,
			wind: hourly.wind[i].value,
			windDirection: hourly.windDirection[i].value,
			dewPoint: hourly.dewPoint[i].value,
			cloudCover: hourly.cloudCover[i].value,
			status: hourly.status[i].value,
			visibility: hourly.visibility[i].value,
			pressure: hourly.pressure[i].value!
		};
	});

	const dailyStartDateTime = configContext.context.referenceTimeInZone.startOf('day');
	const dailyEndDateTime = configContext.context.maxLongTermDataFetch;

	function dailyWeatherData(minY: number, maxY: number, precision: number, inclusive: boolean, shake: number): IterableTimeData<number>[] {
		return quadraticShakeData(weatherRandomizer, dailyStartDateTime, dailyEndDateTime, 24, minY, maxY, precision, inclusive, shake);
	}

	const daily = {
		minTemp: dailyWeatherData(30, 50, temperaturePrecision, true, .2),
		maxTemp: dailyWeatherData(50, 80, temperaturePrecision, true, .2),
		status: dailyWeatherData(0, nWeatherStatusType, 0, false, .1).map((data) => {
			return {
				span: data.span,
				value: data.value as WeatherStatusType
			};
		}),
	};

	const longTermWeather: DailyWeather[] = daily.minTemp.map((minTemp, i) => {
		return {
			day: minTemp.span.begin,
			minTemp: minTemp.value,
			maxTemp: daily.maxTemp[i].value,
			status: daily.status[i].value,
		};
	});

	return {
		errors: null,
		warnings: createTestWarnings(),
		currentWeather: shortTermWeather[0],
		shortTermWeather: shortTermWeather,
		longTermWeather: longTermWeather
	};
}

function quadraticShakeData(randomizer: Randomizer, startDateTime: DateTime, endDateTime: DateTime, hoursGap: number, minY: number, maxY: number, precision: number, inclusive: boolean, shake: number): IterableTimeData<number>[] {
	const hoursBetween = endDateTime.diff(startDateTime, 'hours').hours;

	// Get the three Y points of our quadratic curve.
	const aY = randomizer.randomFloat(minY, maxY, precision, inclusive);
	const bY = randomizer.randomFloat(minY, maxY, precision, inclusive);
	const cY = randomizer.randomFloat(minY, maxY, precision, inclusive);

	// Our first two points will be the max and min of X. The middle point will be random, near the middle.
	const midPoint = hoursBetween / 2;
	const bX = randomizer.shake(0, hoursBetween, 1, midPoint, .5, true);
	const quadratic = quadraticFromPoints([0, aY], [bX, bY], [hoursBetween, cY]);

	const iterables: IterableTimeData<number>[] = [];
	for (let hours = 0; hours < hoursBetween; hours += hoursGap) {
		const value = quadratic(hours);
		const shakenValue = randomizer.shake(minY, maxY, precision, value, shake, inclusive);
		iterables.push({
			span: {
				begin: startDateTime.plus({ hours: hours }),
				end: startDateTime.plus({ hours: hours + hoursGap })
			},
			value: shakenValue
		});
	}
	return iterables;
}
