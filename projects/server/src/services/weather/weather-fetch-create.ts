import { DateTime } from 'luxon';
import * as iso from '@wbtdevlocal/iso';
import { quadraticFromPoints } from '../test/equation';
import { combineSeed, Randomizer, randomizer, TestSeed } from '../test/randomize';
import { IterableTimeData } from './iterator';
import { WeatherConfig } from './weather-config';
import { FetchedWeather } from './weather-fetch';

/** Creates random weather data. Uses a seeded randomizer. */
export function createFetchedWeather(config: WeatherConfig, seed: TestSeed): FetchedWeather {
	const weatherRandomizer = randomizer(combineSeed('_weather_', seed));

	const { referenceTimeInZone, maxShortTermDataFetch, maxLongTermDataFetch } = config.base.live;
	const { temperaturePrecision, defaultPrecision } = config.weather.input;

	const hourlyStartDateTime = referenceTimeInZone.startOf('hour').minus({ hours: 1 });
	const hourlyEndDateTime = maxShortTermDataFetch;

	/*
		We use some interesting techniques here to generate more realistic random data.
		Provided some boundaries, the function below will generate a random quadratic curve function, get data
		from it, then 'shake' that data to make it a little random from data point to data point.
		Overkill? Definitely.
	*/

	function hourlyWeatherData(minY: number, maxY: number, precision: number, inclusive: boolean, shake: number): IterableTimeData<number>[] {
		return quadraticShakeData(weatherRandomizer, hourlyStartDateTime, hourlyEndDateTime, 1, minY, maxY, precision, inclusive, shake);
	}

	const nWindDirection = Object.keys(iso.Weather.WindDirection).filter((k) => !isNaN(k as unknown as number)).length - 1;
	const nWeatherStatusType = Object.keys(iso.Weather.WeatherStatusType).filter((k) => !isNaN(k as unknown as number)).length - 1;

	const hourly = {
		temp: hourlyWeatherData(40, 60, temperaturePrecision, true, .2),
		tempFeelsLike: hourlyWeatherData(40, 60, temperaturePrecision, true, .2),
		wind: hourlyWeatherData(0, 15, defaultPrecision, true, .2),
		windDirection: hourlyWeatherData(0, nWindDirection, 0, false, .2).map((data) => {
			return {
				span: data.span,
				value: data.value as iso.Weather.WindDirection
			};
		}),
		pressure: hourlyWeatherData(1000, 1200, 0, true, .2),
		dewPoint: hourlyWeatherData(20, 40, temperaturePrecision, true, .2),
		cloudCover: hourlyWeatherData(0, 1, defaultPrecision + 2, true, .2),
		status: hourlyWeatherData(0, nWeatherStatusType, 0, false, .1).map((data) => {
			return {
				span: data.span,
				value: data.value as iso.Weather.WeatherStatusType
			};
		}),
		visibility: hourlyWeatherData(2, 20, defaultPrecision, true, .2)
	};
	const shortTermWeather: iso.Weather.WeatherStatus[] = hourly.temp.map((temp, i) => {
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
			pressure: hourly.pressure[i].value
		};
	});

	const dailyStartDateTime = referenceTimeInZone.startOf('day');
	const dailyEndDateTime = maxLongTermDataFetch;

	function dailyWeatherData(minY: number, maxY: number, precision: number, inclusive: boolean, shake: number): IterableTimeData<number>[] {
		return quadraticShakeData(weatherRandomizer, dailyStartDateTime, dailyEndDateTime, 24, minY, maxY, precision, inclusive, shake);
	}

	const daily = {
		minTemp: dailyWeatherData(30, 50, temperaturePrecision, true, .2),
		maxTemp: dailyWeatherData(50, 80, temperaturePrecision, true, .2),
		status: dailyWeatherData(0, nWeatherStatusType, 0, false, .1).map((data) => {
			return {
				span: data.span,
				value: data.value as iso.Weather.WeatherStatusType
			};
		}),
	};

	const longTermWeather: iso.Weather.DailyWeather[] = daily.minTemp.map((minTemp, i) => {
		return {
			day: minTemp.span.begin,
			minTemp: minTemp.value,
			maxTemp: daily.maxTemp[i].value,
			status: daily.status[i].value,
		};
	});

	return {
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
