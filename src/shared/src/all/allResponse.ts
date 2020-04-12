import { Errors, Warnings } from "./issue";
import { Info } from "./info";
import { SunEvent } from "../astro/astroEvent";
import { TideEvent } from "../tide/tideEvent";
import { WeatherEvent } from "../weather/weatherEvent";

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
	tides: {
		/** The percent height of the water level between the high and low. 1 means high, 0 means low. */
		percentBetweenPrevNext: number,
		/** The height, in feet. */
		height: number,
		/** The previous tide event, which may also be the current tide event. */
		previous: TideEvent,
		/** The next tide event. */
		next: TideEvent
	},
	/** Current data about the sunrise/sunset. */
	sun: {
		/** The previous astro sun event relative to now. */
		previous: SunEvent,
		/** The next astro sun event relative to now. */
		next: SunEvent
	},
	/** The current weather information. */
	weather: WeatherEvent
}

export interface AllPredictions {
	/** The cutoff date for all events in this area. Data may go past this point; implementations should check. Date will be an exact time. */
	cutoffDate: Date,
	/** Predictions for tides. */
	tides: {
		/** The min height amongst all provided predictions. */
		minHeight: number,
		/** The max height amongst all provided predictions. */
		maxHeight: number,
		/** Tide prediction events - does not include previous/current, but does include next. Purposefully goes one past cutoff date for graph continuity. */
		events: TideEvent[],
	}
	/** Predictions for sun events.  */
	sun: SunEvent[],
	/** Predictions for weather events. */
	weather: WeatherEvent[]
}

export interface AllDaily {
	/** The cutoff date for all events in this area. Data may go past this point; implementations should check. Date will be an exact time.  */
	cutoffDate: Date,
	/** Weather events, one per day. */
	weather: WeatherEvent[],
	/** Metadata for tides provided in 'today' and 'future'. */
	tides: {
		/** min height amongst all tide events. */
		minHeight: number,
		/** max height amongst all tide events. */
		maxHeight: number,
	}
	/** Information specific to today. */
	today: AllDailyInfo,
	/** Information for each day past today. */
	future: AllDailyInfo[]
}

export interface AllDailyInfo {
	/** The date. A day, but not a specific time. */
	date: Date,
	/** The weather event to describe the day. */
	weather: WeatherEvent,
	/** Tide events for the day - includes events on the day before and the day after for continuity. */
	tides: TideEvent[],
	/** Sun events specific to the day. */
	sun: SunEvent[]
}