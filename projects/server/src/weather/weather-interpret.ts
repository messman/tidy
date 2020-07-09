import { Change, DailyWeather, Measurement, WeatherStatus } from 'tidy-shared';
import { AllIssue } from '../all/all-merge';
import { APIConfigurationContext } from '../all/context';
import { createTimeIterator } from '../util/iterator';
import { IntermediateWeatherValues } from './weather-intermediate';

export interface InterpretedWeather extends AllIssue {
	currentWeather: WeatherStatus;
	shortTermWeather: WeatherStatus[];
	longTermWeather: DailyWeather[];
}

export function interpretWeather(configurationContext: APIConfigurationContext, intermediateWeather: IntermediateWeatherValues): InterpretedWeather {
	if (intermediateWeather.errors) {
		return {
			errors: intermediateWeather.errors,
			warnings: intermediateWeather.warnings,
			currentWeather: null!,
			shortTermWeather: null!,
			longTermWeather: null!
		};
	}

	const current = intermediateWeather.currentWeather;
	const currentWeatherStatus: WeatherStatus = {
		time: current.time,
		temp: toEmptyMeasurement(current.temp),
		tempFeelsLike: toEmptyMeasurement(current.tempFeelsLike),
		wind: toEmptyMeasurement(current.wind),
		windDirection: current.windDirection,
		visibility: toEmptyMeasurement(current.visibility),
		cloudCover: toEmptyMeasurement(current.cloudCover),
		dewPoint: toEmptyMeasurement(current.dewPoint),
		pressure: toEmptyMeasurement(current.pressure),
		status: current.status
	};

	const referenceTime = configurationContext.context.referenceTimeInZone;
	const hoursGapBetweenWeatherData = configurationContext.configuration.weather.hoursGapBetweenWeatherData;
	const shortTermLimit = configurationContext.context.maxShortTermDataFetch;

	const shortTermIterator = createTimeIterator(intermediateWeather.shortTermWeather.map((shortTerm, i) => {
		const next = intermediateWeather.shortTermWeather[i];
		const nextTime = next?.time || shortTerm.time.plus({ hours: 1 });

		// We aren't doing real measurements right now, so just do fake ones.
		const value: WeatherStatus = {
			time: shortTerm.time,
			temp: toEmptyMeasurement(shortTerm.temp),
			tempFeelsLike: toEmptyMeasurement(shortTerm.tempFeelsLike),
			wind: toEmptyMeasurement(shortTerm.wind),
			windDirection: shortTerm.windDirection,
			dewPoint: toEmptyMeasurement(shortTerm.dewPoint),
			visibility: toEmptyMeasurement(shortTerm.visibility),
			cloudCover: toEmptyMeasurement(shortTerm.cloudCover),
			pressure: toEmptyMeasurement(shortTerm.pressure),
			status: shortTerm.status
		};

		return {
			span: {
				begin: shortTerm.time,
				end: nextTime
			},
			value: value
		};
	}));

	const currentHour = referenceTime.startOf("hour");
	// Hourly weather comes from the closest even hour (moving forward).
	// Note - this means we may skip forward into the next day.
	let startHour = currentHour;
	if (startHour.hour % 2 === 1) {
		startHour = startHour.plus({ hours: 1 });
	}
	// Get the hours between our start hour and our short-term limit
	const shortHoursBetween = shortTermLimit.diff(startHour, "hours").hours;
	const nShortTermIterations = Math.ceil(shortHoursBetween / hoursGapBetweenWeatherData);

	const shortTermWeather: WeatherStatus[] = [];

	for (let i = 0; i < nShortTermIterations; i++) {
		const dateTime = startHour.plus({ hours: i * hoursGapBetweenWeatherData });
		const next = shortTermIterator.next(dateTime);
		if (!next) {
			break;
		}
		shortTermWeather.push(next);
	}

	const longTermLimit = configurationContext.context.maxLongTermDataFetch;
	const longTermWeather: DailyWeather[] = intermediateWeather.longTermWeather.filter((longTerm) => {
		return longTerm.day >= referenceTime.startOf('day') && longTerm.day <= longTermLimit;
	});

	return {
		errors: null,
		warnings: intermediateWeather.warnings,
		currentWeather: currentWeatherStatus,
		shortTermWeather: shortTermWeather,
		longTermWeather: longTermWeather
	};
}

function toEmptyMeasurement(value: number | null): Measurement {
	return {
		entity: value,
		change: Change.unknown
	};
}