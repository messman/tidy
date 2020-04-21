import { Errors, Warnings } from "./issue";
import { Info } from "./info";
import { SunEvent } from "../astro/astro-event";
import { TideEvent, TideEventRange, TideExtremes } from "../tide/tide-event";
import { WeatherStatus, DailyWeather } from "../weather/weather-status";

export interface AllResponse {
	/** Info about the request. */
	info: Info,
	/** Error information about the request. Null if no errors. */
	error: Errors | null,
	/** Success information - the response data. Null if errors.  */
	data: AllResponseData | null
}

export interface AllResponseData {
	/** Warnings. Null if no warnings. */
	warning: Warnings | null,
	/** Information about the current state of the location. */
	current: AllCurrent,
	/** Prediction data for the location. */
	predictions: AllPredictions,
	/** Daily-view information for the location. */
	daily: AllDaily
}

export interface AllCurrent {
	/** Current data about the tides. */
	tides: AllCurrentTides,
	/** Current data about the sunrise/sunset. */
	sun: {
		/** The previous astro sun event relative to now. */
		previous: SunEvent,
		/** The next astro sun event relative to now. */
		next: SunEvent
	},
	/** The current weather information. */
	weather: WeatherStatus
}

export interface AllCurrentTides {
	/** The height, in feet. */
	height: number,
	/** The previous tide event, which may also be the current tide event. */
	previous: TideEvent,
	/** The next tide event. */
	next: TideEvent
}

export interface AllPredictions {
	/** The cutoff date for all events in this area. Data may go past this point; implementations should check. Date will be an exact time. */
	cutoffDate: Date,
	/** Predictions for tides. */
	tides: TideEventRange
	/** Predictions for sun events.  */
	sun: SunEvent[],
	/** Predictions for weather events. */
	weather: WeatherStatus[]
}

export interface AllDaily {
	/** The cutoff date for all events in this area. Data may go past this point; implementations should check. Date will be an exact time.  */
	cutoffDate: Date,
	/** Metadata for tides provided in 'today' and 'future'. */
	tideExtremes: TideExtremes,
	/** Information for each day from our reference time day to our cutoff date. */
	days: AllDailyDay[]
}

export interface AllDailyDay {
	/** The date. A day, but not a specific time. */
	date: Date,
	/** The weather event to describe the day. */
	weather: DailyWeather,
	/** Tide events for the day - includes events on the day before and the day after for continuity. */
	tides: TideEventRange,
	/** Sun events specific to the day. */
	sun: SunEvent[]
}