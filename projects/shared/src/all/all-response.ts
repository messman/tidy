import { DateTime } from 'luxon';
import { SunEvent } from '../astro/astro-event';
import { TideEvent, TideEventRange, TideExtremes } from '../tide/tide-event';
import { DailyWeather, WeatherStatus } from '../weather/weather-status';
import { Info } from './info';
import { Errors, Warnings } from './issue';

export interface AllResponse<TDate = DateTime> {
	/** Info about the request. */
	info: Info<TDate>,
	/** Error information about the request. Null if no errors. */
	error: Errors | null,
	/** Success information - the response data. Null if errors.  */
	all: AllResponseData<TDate> | null;
}

export interface AllResponseData<TDate = DateTime> {
	/** Warnings. Null if no warnings. */
	warning: Warnings | null,
	/** Information about the current state of the location. */
	current: AllCurrent<TDate>,
	/** Prediction data for the location. */
	predictions: AllPredictions<TDate>,
	/** Daily-view information for the location. */
	daily: AllDaily<TDate>;
}

export interface AllCurrent<TDate = DateTime> {
	/** Current data about the tides. */
	tides: AllCurrentTides<TDate>,
	/** Current data about the sunrise/sunset. */
	sun: {
		/** The previous astro sun event relative to now. */
		previous: SunEvent<TDate>,
		/** The next astro sun event relative to now. */
		next: SunEvent<TDate>;
	},
	/** The current weather information. */
	weather: WeatherStatus<TDate>;
}

export interface AllCurrentTides<TDate = DateTime> {
	/** The height, in feet. */
	height: number,
	/** The previous tide event, which may also be the current tide event. */
	previous: TideEvent<TDate>,
	/** The next tide event. */
	next: TideEvent<TDate>;
}

export interface AllPredictions<TDate = DateTime> {
	/** The cutoff date for all events in this area. Data may go past this point; implementations should check. Date will be an exact time. */
	cutoffDate: TDate,
	/** Predictions for tides. */
	tides: TideEventRange<TDate>;
	/** Predictions for sun events.  */
	sun: SunEvent<TDate>[],
	/** Predictions for weather events. */
	weather: WeatherStatus<TDate>[];
}

export interface AllDaily<TDate = DateTime> {
	/** The cutoff date for all events in this area. Data may go past this point; implementations should check. Date will be an exact time.  */
	cutoffDate: TDate,
	/** Metadata for tides provided in 'today' and 'future'. */
	tideExtremes: TideExtremes<TDate>,
	/** Information for each day from our reference time day to our cutoff date. */
	days: AllDailyDay<TDate>[];
}

export interface AllDailyDay<TDate = DateTime> {
	/** The date. A day, but not a specific time. */
	date: TDate,
	/** The weather event to describe the day. */
	weather: DailyWeather<TDate>,
	/** Tide events for the day - includes events on the day before and the day after for continuity. */
	tides: TideEventRange<TDate>,
	/** Sun events specific to the day. */
	sun: SunEvent<TDate>[];
}