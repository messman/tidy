import { DateTime } from 'luxon';
import { AstroLunarPhase, AstroLunarPhaseDay, enumKeys, mapNumberEnumValue, WeatherPointCurrent, WeatherPointDaily, WeatherPointHourly, WeatherStatusType } from '@wbtdevlocal/iso';
import { BaseConfig } from '../config';
import { baseLogger } from '../logging/pino';
import { quadraticFromPoints } from '../test/equation';
import { combineSeed, Randomizer, randomizer, TestSeed } from '../test/randomize';
import { IterableTimeData } from './iterator';
import { createWeatherPointHourlyId, degreesToDirection, fixFetchedWeather, getIndicator, WeatherFetched, WithoutIndicator } from './weather-shared';

/** Creates random weather data. Uses a seeded randomizer. */
export function createWeather(config: BaseConfig, seed: TestSeed): WeatherFetched {
	const weatherRandomizer = randomizer(combineSeed('_weather_', seed));

	const { referenceTime, futureCutoff } = config;

	const hourlyStartDateTime = referenceTime.startOf('hour').minus({ hours: 1 });
	const hourlyEndDateTime = hourlyStartDateTime.plus({ hours: 72 });

	/*
		We use some interesting techniques here to generate more realistic random data.
		Provided some boundaries, the function below will generate a random quadratic curve function, get data
		from it, then 'shake' that data to make it a little random from data point to data point.
		Overkill? Definitely.
	*/

	function hourlyWeatherData(minY: number, maxY: number, precision: number, inclusive: boolean, shake: number): IterableTimeData<number>[] {
		return quadraticShakeData(weatherRandomizer, hourlyStartDateTime, hourlyEndDateTime, 1, minY, maxY, precision, inclusive, shake);
	}

	const hourlyTemp = hourlyWeatherData(40, 60, 1, true, .2);
	const hourlyTempFeelsLike = hourlyWeatherData(40, 60, 1, true, .2);
	const hourlyWind = hourlyWeatherData(0, 15, 1, true, .2);
	const hourlyWindAngle = hourlyWeatherData(0, 360, 0, false, .2).map((data) => {
		return {
			span: data.span,
			value: data.value
		};
	});
	const hourlyWindDirection = hourlyWindAngle.map((hourly) => {
		return {
			span: hourly.span,
			value: degreesToDirection(hourly.value)
		};
	});
	const hourlyPressure = hourlyWeatherData(1000, 1200, 0, true, .2);
	const hourlyDewPoint = hourlyWeatherData(20, 40, 1, true, .2);
	const hourlyCloudCover = hourlyWeatherData(0, 1, 3, true, .2);

	const weatherStatusComboIndex = weatherRandomizer.randomInt(0, weightedWeatherStatusCombos.length, false);
	const weatherStatusCombo = weightedWeatherStatusCombos[weatherStatusComboIndex];
	let weatherStatuses: WeatherStatusType[] = [];
	weatherStatusCombo.forEach((statusType) => {
		const weight = mapNumberEnumValue(WeatherStatusType, weatherStatusWeights, statusType);
		for (let i = 0; i < weight; i++) {
			weatherStatuses.push(statusType);
		}
	});
	const hourlyStatus = hourlyWeatherData(0, weatherStatuses.length, 0, false, .5).map((data) => {
		return {
			span: data.span,
			value: weatherStatuses[data.value]
		};
	});

	const hourlyVisibility = hourlyWeatherData(2, 20, 1, true, .2).map((data) => {
		if (data.value >= 19) {
			return { ...data, value: null };
		}
		return data;
	});
	const hourlyHumidity = hourlyWeatherData(0, 1, 3, true, .2);
	const hourlyUvi = hourlyWeatherData(1, 11, 1, true, .2);
	const hourlyPop = hourlyWeatherData(0, 1, 3, true, .2);


	const hourly = hourlyTemp.map<WeatherPointHourly>((temp, i) => {
		const withoutIndicator: WithoutIndicator<WeatherPointHourly> = {
			id: createWeatherPointHourlyId(temp.span.begin),
			time: temp.span.begin,
			temp: temp.value,
			tempFeelsLike: hourlyTempFeelsLike[i].value,
			wind: hourlyWind[i].value,
			windDirection: hourlyWindDirection[i].value,
			windAngle: hourlyWindAngle[i].value,
			dewPoint: hourlyDewPoint[i].value,
			cloudCover: hourlyCloudCover[i].value,
			status: hourlyStatus[i].value,
			visibility: hourlyVisibility[i].value,
			pressure: hourlyPressure[i].value,
			humidity: hourlyHumidity[i].value,
			uvi: hourlyUvi[i].value,
			pop: hourlyPop[i].value
		};

		return {
			...withoutIndicator,
			indicator: getIndicator(withoutIndicator)
		};
	});

	const dailyStartDateTime = referenceTime.startOf('day');
	const dailyEndDateTime = futureCutoff;
	//const daysBetween = dailyEndDateTime.diff(dailyStartDateTime, 'days').days;

	function dailyWeatherData(minY: number, maxY: number, precision: number, inclusive: boolean, shake: number): IterableTimeData<number>[] {
		return quadraticShakeData(weatherRandomizer, dailyStartDateTime, dailyEndDateTime, 24, minY, maxY, precision, inclusive, shake);
	}

	const dailyMinTemp = dailyWeatherData(30, 50, 1, true, .2);
	const dailyMaxTemp = dailyWeatherData(50, 80, 1, true, .2);
	const dailyEntry = dailyWeatherData(0, weatherStatuses.length, 0, false, .3).map((data, i, arr) => {
		if (data.value === weatherStatuses.length) {
			baseLogger.info('HERE', { value: data.value, i, arr });
		}
		return {
			span: data.span,
			value: weatherStatuses[data.value]
		};
	});
	const dailyPop = dailyWeatherData(0, 1, 3, true, .2);

	const daily = dailyMinTemp.map<WeatherPointDaily>((minTemp, i) => {
		const withoutIndicator: WithoutIndicator<WeatherPointDaily> = {
			time: minTemp.span.begin,
			minTemp: minTemp.value,
			maxTemp: dailyMaxTemp[i].value,
			status: dailyEntry[i].value,
			pop: dailyPop[i].value
		};

		return {
			...withoutIndicator,
			indicator: getIndicator(withoutIndicator)
		};
	});

	const nMoonPhase = enumKeys(AstroLunarPhase).length - 1;
	const dailyMoonPhaseIterable = dailyWeatherData(0, nMoonPhase, 0, false, 0);

	const moonPhaseDaily = dailyMoonPhaseIterable.map<AstroLunarPhaseDay>((moonPhase, i) => {
		const day = referenceTime.startOf('day').plus({ days: i });
		return {
			time: day,
			moon: Math.round(moonPhase.value) as AstroLunarPhase,
		};
	});

	// /*
	// 	For creating test data for moonrise and moonset, see observations:
	// 	https://www.timeanddate.com/moon/usa/wells?month=6&year=2022

	// 	Sometimes the moonrise of today will set tomorrow / the moonset of today rose yesterday.
	// 	Try to get our data flipping between this case and the normal one.

	// 	A lunar day is always at least 24 hours - it just varies when we see rise and set.
	// 	It's more complicated than that, but that range is good enough for testing.
	// */

	// // Time of lunar day that is between rise and set - (9 to 14) - linear
	// const minLunarShowMinutes = 9 * 60;
	// const maxLunarShowMinutes = 14 * 60;
	// const roughLunarDayMinutes = 25 * 60;

	// const startLunarShowMinutes = weatherRandomizer.randomInt(minLunarShowMinutes, maxLunarShowMinutes, true);
	// const stopLunarShowMinutes = weatherRandomizer.randomInt(minLunarShowMinutes, maxLunarShowMinutes, true);
	// const lunarShowMinutesFunc = linearFromPoints([0, startLunarShowMinutes], [daysBetween, stopLunarShowMinutes]);
	// let isRiseAtStart = weatherRandomizer.randomInt(0, 1, true) === 0;
	// let lunarTime = referenceTime.startOf('day').minus({ hours: weatherRandomizer.randomInt(1, 6, true) });

	// const lunar: Astro.BodyEvent[] = [];
	// for (let i = 0; i < daysBetween; i++) {
	// 	const lunarShowMinutes = lunarShowMinutesFunc(i);
	// 	if (i !== 0 || isRiseAtStart) {
	// 		lunarTime = lunarTime.plus({ minutes: roughLunarDayMinutes - lunarShowMinutes });
	// 		lunar.push({
	// 			isRise: true,
	// 			time: lunarTime
	// 		});
	// 	}
	// 	else {
	// 		lunarTime = lunarTime.plus({ minutes: lunarShowMinutes });
	// 		lunar.push({
	// 			isRise: false,
	// 			time: lunarTime
	// 		});
	// 	}
	// }

	const current: WeatherPointCurrent = {
		...(hourly[0]), // technically contains the id
		time: referenceTime
	};

	return fixFetchedWeather(config, {
		current,
		hourly,
		daily,
		moonPhaseDaily,
		//lunar
	});
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

const weatherStatusCombos: [number, WeatherStatusType[]][] = [
	// Clear or cloudy
	[3, [WeatherStatusType.clear, WeatherStatusType.clouds_few, WeatherStatusType.clouds_most, WeatherStatusType.clouds_over, WeatherStatusType.fog]],

	// Clear, hot, or rainy
	[2, [WeatherStatusType.clear, WeatherStatusType.clear_hot, WeatherStatusType.clouds_most, WeatherStatusType.thun_light, WeatherStatusType.clouds_few, WeatherStatusType.rain_drizzle, WeatherStatusType.rain_light, WeatherStatusType.haze]],

	// Clear, cold, or snowy / sleety
	[1, [WeatherStatusType.clear, WeatherStatusType.clear_cold, WeatherStatusType.clouds_most, WeatherStatusType.rain_freeze, WeatherStatusType.snow_sleet, WeatherStatusType.snow_light]],

	// Cloudy and stormy
	[1, [WeatherStatusType.rain_drizzle, WeatherStatusType.rain_heavy, WeatherStatusType.thun_light, WeatherStatusType.clouds_over, WeatherStatusType.clouds_few, WeatherStatusType.rain_medium]],

	// Intense
	[1, [WeatherStatusType.rain_heavy, WeatherStatusType.thun_heavy, WeatherStatusType.dust, WeatherStatusType.intense_storm, WeatherStatusType.clouds_most, WeatherStatusType.clear]],

	// Unknown
	[1, [WeatherStatusType.unknown, WeatherStatusType.clear, WeatherStatusType.rain_light, WeatherStatusType.clouds_few]],
];

const weightedWeatherStatusCombos: WeatherStatusType[][] = [];
weatherStatusCombos.forEach((tuple) => {
	const [weight, combo] = tuple;
	for (let i = 0; i < weight; i++) {
		weightedWeatherStatusCombos.push(combo);
	}
});

const weatherStatusWeights: Record<keyof typeof WeatherStatusType, number> = {
	clear: 3,
	clear_hot: 2,
	clear_cold: 2,
	clouds_few: 2,
	clouds_some: 2,

	clouds_most: 1,
	clouds_over: 1,

	rain_drizzle: 2,
	rain_light: 1,
	rain_medium: 1,
	rain_heavy: 1,
	rain_freeze: 1,
	snow_light: 1,
	snow_medium: 1,
	snow_heavy: 1,
	snow_sleet: 1,
	snow_rain: 1,
	thun_light: 1,
	thun_medium: 1,
	thun_heavy: 1,
	intense_storm: 1,
	intense_other: 1,
	dust: 1,
	smoke: 1,
	haze: 1,
	fog: 1,
	unknown: 1,
};