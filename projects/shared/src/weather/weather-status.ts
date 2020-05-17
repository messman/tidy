import { WeatherStatusType } from "./weather-status-type";
import { DateTime } from 'luxon';

export interface WeatherStatus<TDate = DateTime> {
	/** Time of the weather status. */
	time: TDate,
	/** The description of the weather at the time. */
	status: WeatherStatusType,
	/** The temperature, in degrees fahrenheit. */
	temp: Measurement,
	/** The temperature "feels like", in degrees fahrenheit. */
	tempFeelsLike: Measurement,
	/** The chance for rain, as a percentage, between 0 and 1. */
	chanceRain: Measurement,
	/** The wind speed, in miles per hour. */
	wind: Measurement,
	/** The wind direction. */
	windDirection: WindDirection,
	/** The dew point, in degrees fahrenheit. */
	dewPoint: Measurement,
	/** Percent cloud cover. */
	cloudCover: Measurement,
	/** Visibility in miles. */
	visibility: Measurement
}

export interface DailyWeather<TDate = DateTime> {
	/** The date of the weather status. */
	day: TDate,
	/** The description of the weather on the day. */
	status: WeatherStatusType,
	/** Minimum expected temperature. */
	minTemp: number,
	/** Maximum expected temperature. */
	maxTemp: number,
	/** The chance for rain, as a percentage, between 0 and 1. */
	maxChanceRain: number,
}

/** The result data from the iterator call. */
export interface Measurement {
	entity: number | null,
	change: Change,
}

/** The change that occurred from the previous data point to this one. */
export enum Change {
	/** Some data is unavailable (start, end, etc). */
	unknown,
	/** This is 'lower' than the previous data. */
	lower,
	/** This is the same as the previous data. */
	same,
	/** This is 'higher' than the previous data. */
	higher
}

export enum WindDirection {
	N = 0,
	NNE,
	NE,
	ENE,
	E,
	ESE,
	SE,
	SSE,
	S,
	SSW,
	SW,
	WSW,
	W,
	WNW,
	NW,
	NNW
}