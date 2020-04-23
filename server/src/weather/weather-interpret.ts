import { WeatherStatus, DailyWeather, Measurement, WeatherStatusType, WindDirection } from 'tidy-shared';
import { APIConfigurationContext } from '../context';
import { IntermediateWeatherValues } from './weather-intermediate';
import { createTimeChangeIterator, createTimeIterator, TimeIterator } from '../util/iterator';
import { DateTime } from 'luxon';

export interface InterpretedWeather {
	currentWeather: WeatherStatus,
	shortTermWeather: WeatherStatus[],
	longTermWeather: DailyWeather[]
}

interface Iterators {
	temperature: TimeIterator<Measurement>,
	feelsLike: TimeIterator<Measurement>,
	chanceRain: TimeIterator<Measurement>,
	windDirection: TimeIterator<WindDirection>,
	wind: TimeIterator<Measurement>,
	dewPoint: TimeIterator<Measurement>,
	cloudCover: TimeIterator<Measurement>,
	visibility: TimeIterator<Measurement>,
	status: TimeIterator<WeatherStatusType>,
}

export function interpretWeather(configurationContext: APIConfigurationContext, weatherValues: IntermediateWeatherValues): InterpretedWeather {

	const referenceTime = configurationContext.context.referenceTimeInZone;
	const referenceHour = referenceTime.startOf("hour");

	// Create iterators for each of the root values, stored independently
	const iterators: Iterators = {
		temperature: createTimeChangeIterator(weatherValues.temp),
		feelsLike: createTimeChangeIterator(weatherValues.tempFeelsLike),
		chanceRain: createTimeChangeIterator(weatherValues.chanceRain),
		windDirection: createTimeIterator(weatherValues.windDirection),
		wind: createTimeChangeIterator(weatherValues.wind),
		dewPoint: createTimeChangeIterator(weatherValues.dewPoint),
		cloudCover: createTimeChangeIterator(weatherValues.cloudCover),
		visibility: createTimeChangeIterator(weatherValues.visibility),
		status: createTimeIterator(weatherValues.status)
	};

	const currentHour = referenceHour.plus({ hours: 1 });
	const currentWeather = getWeatherStatusFromTime(currentHour.toJSDate(), iterators);

	const hoursGapBetweenWeatherData = configurationContext.configuration.weather.hoursGapBetweenWeatherData;
	const shortTermLimit = configurationContext.context.maxShortTermDataFetch;
	const shortTermWeather: WeatherStatus[] = [];

	// Current weather comes from the next hour, but all hourly data starts with current hour.
	const startHour = referenceHour.plus({ hours: hoursGapBetweenWeatherData });
	// Get the hours between our start hour and our short-term limit
	const shortHoursBetween = shortTermLimit.diff(startHour, "hours").hours;
	const nShortTermIterations = Math.ceil(shortHoursBetween / hoursGapBetweenWeatherData);

	for (let i = 0; i < nShortTermIterations; i++) {
		const dateTime = startHour.plus({ hours: i * hoursGapBetweenWeatherData });
		shortTermWeather.push(getWeatherStatusFromTime(dateTime.toJSDate(), iterators));
	}

	resetIterators(iterators);

	const longTermWeatherStatuses: WeatherStatus[] = [];
	const longTermLimit = configurationContext.context.maxLongTermDataFetch;
	const longHoursBetween = Math.floor(longTermLimit.diff(startHour, "hours").hours);

	for (let i = 0; i < longHoursBetween; i++) {
		const dateTime = startHour.plus({ hours: i });
		longTermWeatherStatuses.push(getWeatherStatusFromTime(dateTime.toJSDate(), iterators));
	}

	const longTermWeatherStatusesByDay: WeatherStatus[][] = [];
	let previousEventDateTime: DateTime | null = null!;
	let currentEventsOfDay: WeatherStatus[] | null = null;

	longTermWeatherStatuses.forEach((t) => {
		// Tide events are already in the time zone we care about.
		const eventDateTime = DateTime.fromJSDate(t.time, { zone: configurationContext.configuration.location.timeZoneLabel });
		if (previousEventDateTime && previousEventDateTime.hasSame(eventDateTime, 'day')) {
			currentEventsOfDay!.push(t);
		}
		else {
			previousEventDateTime = eventDateTime;
			currentEventsOfDay = [t];
			longTermWeatherStatusesByDay.push(currentEventsOfDay);
		}
	});

	const longTermWeather: DailyWeather[] = longTermWeatherStatusesByDay.map((statuses) => {
		const day = DateTime.fromJSDate(statuses[0].time, { zone: configurationContext.configuration.location.timeZoneLabel }).startOf('day');

		const status = getDailyStatus(statuses.map((s) => {
			return s.status;
		}));

		let minTemp: number = Infinity;
		let maxTemp: number = -Infinity;
		let maxChanceRain: number = -Infinity;

		statuses.forEach((s) => {
			const temp = s.temp.entity;
			if (temp) {
				if (temp < minTemp) {
					minTemp = temp;
				}
				if (temp > maxTemp) {
					maxTemp = temp;
				}
			}
			const chanceRain = s.chanceRain.entity;
			if (chanceRain && chanceRain > maxChanceRain) {
				maxChanceRain = chanceRain;
			}
		});

		return {
			day: day.toJSDate(),
			status: status,
			minTemp: minTemp,
			maxTemp: maxTemp,
			maxChanceRain: maxChanceRain
		}
	});

	return {
		currentWeather: currentWeather,
		shortTermWeather: shortTermWeather,
		longTermWeather: longTermWeather
	};
}

function getWeatherStatusFromTime(time: Date, iterators: Iterators): WeatherStatus {
	return {
		time: time,
		temp: iterators.temperature.next(time)!,
		tempFeelsLike: iterators.feelsLike.next(time)!,
		chanceRain: iterators.chanceRain.next(time)!,
		windDirection: iterators.windDirection.next(time)!,
		wind: iterators.wind.next(time)!,
		dewPoint: iterators.dewPoint.next(time)!,
		cloudCover: iterators.cloudCover.next(time)!,
		visibility: iterators.visibility.next(time)!,
		status: iterators.status.next(time)!,
	}
}

function resetIterators(iterators: Iterators): void {
	Object.keys(iterators).forEach((key) => {
		const keyOf = key as keyof Iterators;
		iterators[keyOf].reset();
	});
}


function getDailyStatus(statuses: WeatherStatusType[]): WeatherStatusType {
	// For now, we can just do the mode. In teh future, maybe a more rare status type will supersede.

	const weatherStatusCounts: { [key: number]: number } = {};

	statuses.forEach((key) => {
		if (!weatherStatusCounts[key]) {
			weatherStatusCounts[key] = 1;
		}
		else {
			weatherStatusCounts[key] += 1;
		}
	});

	let mostOften: WeatherStatusType = WeatherStatusType.unknown;
	let mostOftenCount: number = 0;

	Object.keys(weatherStatusCounts).forEach((key) => {
		const keyOf = parseInt(key);
		const count = weatherStatusCounts[keyOf];
		if (count > mostOftenCount) {
			mostOftenCount = count;
			mostOften = keyOf as WeatherStatusType;
		}
	});

	return mostOften;
}

/*
	What we should track:
	- temperature
	- apparentTemperature
	windDirection
	windSpeed
	probabilityOfPrecipitation

	- relativeHumidity
	- dewpoint
	- minTemperature
	- maxTemperature
	skyCover
	windChill
	visibility

	weather (description)

	Other:
	temperature
	dewpoint
	maxtemperature
	mintemperature
	relativeHumidity
	apparentTemperature (feels like)
	heatIndex
	windChill
	skyCover
	windDirection
	windSpeed
	windGust
	weather
	probabilityOfPrecipitation
	quantitativePrecipitation
	iceAccumulation
	snowfallAmount
	ceilingHiehgt
	visibility
	transportWindSpeed
	transpoirtWindDirection
	MixingHeight
	...
*/

