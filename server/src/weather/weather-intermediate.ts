import { IterableTimeData } from "../util/iterator";
import { WeatherStatusType } from "tidy-shared/dist/weather/weather-status-type";
import { WindDirection } from "tidy-shared";
import { AllIssue } from "../all/all-merge";


export interface IntermediateWeatherValues extends AllIssue {
	temp: IterableTimeData<number>[],
	tempFeelsLike: IterableTimeData<number>[],
	chanceRain: IterableTimeData<number>[],
	windDirection: IterableTimeData<WindDirection>[],
	wind: IterableTimeData<number>[],
	dewPoint: IterableTimeData<number>[],
	cloudCover: IterableTimeData<number>[],
	visibility: IterableTimeData<number>[],

	status: IterableTimeData<WeatherStatusType>[]
}

export function createEmptyIntermediateWeather(): IntermediateWeatherValues {
	return {
		errors: null!,
		warnings: null!,
		temp: null!,
		tempFeelsLike: null!,
		chanceRain: null!,
		windDirection: null!,
		wind: null!,
		dewPoint: null!,
		cloudCover: null!,
		visibility: null!,
		status: null!
	}
}