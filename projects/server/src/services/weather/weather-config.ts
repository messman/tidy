import { BaseConfig } from '../config';

export interface WeatherInput {
	/** The gap in hours between weather data - so we aren't grabbing more data than we need from the API to send down to a client that can't show it. */
	hoursGapBetweenWeatherData: number,
	/** Whether or not to include changes from one datum to another. */
	includeChanges: boolean,
	/** Digits after the decimal to include in temperature measurements. */
	temperaturePrecision: number,
	/** Digits after the decimal to include in other non-temperature measurements. */
	defaultPrecision: number,
}

export interface WeatherConfig {
	base: BaseConfig;
	weather: {
		input: WeatherInput;
	};
}