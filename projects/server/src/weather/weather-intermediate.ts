import { DailyWeather, WeatherStatus } from '@wbtdevlocal/iso';
import { AllIssue } from '../all/all-merge';

export interface IntermediateWeatherValues extends AllIssue {
	currentWeather: WeatherStatus;
	shortTermWeather: WeatherStatus[];
	longTermWeather: DailyWeather[];
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