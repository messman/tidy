import { DateTime } from 'luxon';
import { WeatherStatusType } from './weather-status-type';

export interface WeatherPointBase {
	/** Time of the weather status. */
	time: DateTime;
	/** The description of the weather at the time. */
	status: WeatherStatusType;
	/** The temperature, in degrees fahrenheit. */
	temp: number;
	/** The temperature "feels like", in degrees fahrenheit. */
	tempFeelsLike: number;
	/** The wind speed, in miles per hour. */
	wind: number;
	/** The wind direction (from). */
	windDirection: WeatherWindDirection;
	/** The wind angle (from), where 0 is north; [0, 360). */
	windAngle: number;
	/** The dew point, in degrees fahrenheit. */
	dewPoint: number;
	/** UV Index. */
	uvi: number;
	/** Percent (relative) humidity, [0, 1] */
	humidity: number;
	/** Atmospheric pressure, in millibars. */
	pressure: number;
	/** Percent cloud cover, [0, 1] */
	cloudCover: number;
	/** Visibility in miles. Null if unknown or at max measured. */
	visibility: number | null;
	/** Probability of precipitation, [0, 1] */
	pop: number;
	/** Easy-to-check indicator of whether the weather is good. */
	indicator: WeatherIndicator;
}

export enum WeatherIndicator {
	bad,
	okay,
	best
}

/** Contains information for current weather. */
export interface WeatherPointCurrent extends WeatherPointBase {

}

/** Contains information for current and hourly weather. */
export interface WeatherPointHourly extends WeatherPointBase {
	id: string;
}

export type WithDaytime<T> = T & {
	/** Whether it's daytime or not. */
	isDaytime: boolean;
};

export interface WeatherPointDaily {
	/** Time of the weather status. Start of the day. */
	time: DateTime;
	/** The description of the weather on the day. */
	status: WeatherStatusType;
	/** Minimum expected temperature. */
	minTemp: number;
	/** Maximum expected temperature. */
	maxTemp: number;
	/** Probability of precipitation, [0, 1] */
	pop: number;
	/** Easy-to-check indicator of whether the weather is good. */
	indicator: WeatherIndicator;
}

export enum WeatherWindDirection {
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