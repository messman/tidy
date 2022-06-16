import { DateTime } from 'luxon';
import { StatusType } from './weather-status-type';

export interface CommonCurrentHourly {
	/** Time of the weather status. */
	time: DateTime;
	/** The description of the weather at the time. */
	status: StatusType;
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
	indicator: Indicator;
}

export enum Indicator {
	bad,
	okay,
	best
}

/** Contains information for current weather. */
export interface Current extends CommonCurrentHourly {

}

/** Contains information for current and hourly weather. */
export interface Hourly extends CommonCurrentHourly {
}

export interface Day {
	/** Time of the weather status. Start of the day. */
	time: DateTime;
	/** The description of the weather on the day. */
	status: StatusType;
	/** Minimum expected temperature. */
	minTemp: number;
	/** Maximum expected temperature. */
	maxTemp: number;
	/** Probability of precipitation, [0, 1] */
	pop: number;
	/** Easy-to-check indicator of whether the weather is good. */
	indicator: Indicator;
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