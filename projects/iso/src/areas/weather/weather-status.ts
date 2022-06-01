import { DateTime } from 'luxon';
import { WeatherStatusType } from './weather-status-type';

export interface WeatherStatus {
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
	/** The wind direction. */
	windDirection: WindDirection;
	/** The dew point, in degrees fahrenheit. */
	dewPoint: number;
	/** Atmospheric pressure, in millibars. */
	pressure: number;
	/** Percent cloud cover. */
	cloudCover: number;
	/** Visibility in miles. */
	visibility: number | null;
}

export interface DailyWeather {
	/** The date of the weather status. */
	day: DateTime;
	/** The description of the weather on the day. */
	status: WeatherStatusType;
	/** Minimum expected temperature. */
	minTemp: number;
	/** Maximum expected temperature. */
	maxTemp: number;
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