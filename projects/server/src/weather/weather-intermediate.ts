import { DateTime } from 'luxon';
import { DailyWeather, WeatherStatus } from 'tidy-shared';
import { AllIssue } from '../all/all-merge';

export interface IntermediateWeatherValues extends AllIssue {
	currentWeather: WeatherStatus<DateTime, number>;
	shortTermWeather: WeatherStatus<DateTime, number | null>[];
	longTermWeather: DailyWeather<DateTime>[];
}

export function createEmptyIntermediateWeather(): IntermediateWeatherValues {
	return {
		errors: null!,
		warnings: null!,
		currentWeather: null!,
		shortTermWeather: null!,
		longTermWeather: null!
	};
}