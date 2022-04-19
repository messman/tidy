import { DateTime } from 'luxon';
import { WeatherStatusType } from './weather-status-type';

export interface WeatherStatus<TDate = DateTime, TMeasurement = Measurement> {
	/** Time of the weather status. */
	time: TDate;
	/** The description of the weather at the time. */
	status: WeatherStatusType;
	/** The temperature, in degrees fahrenheit. */
	temp: TMeasurement;
	/** The temperature "feels like", in degrees fahrenheit. */
	tempFeelsLike: TMeasurement;
	/** The wind speed, in miles per hour. */
	wind: TMeasurement;
	/** The wind direction. */
	windDirection: WindDirection;
	/** The dew point, in degrees fahrenheit. */
	dewPoint: TMeasurement;
	/** Atmospheric pressure, in millibars. */
	pressure: TMeasurement;
	/** Percent cloud cover. */
	cloudCover: TMeasurement;
	/** Visibility in miles. */
	visibility: TMeasurement;
}

export interface DailyWeather<TDate = DateTime> {
	/** The date of the weather status. */
	day: TDate;
	/** The description of the weather on the day. */
	status: WeatherStatusType;
	/** Minimum expected temperature. */
	minTemp: number;
	/** Maximum expected temperature. */
	maxTemp: number;
}

/** The result data from the iterator call. */
export interface Measurement {
	entity: number | null;
	/** May be undefined if API does not support returning change data. */
	change: Change | undefined;
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