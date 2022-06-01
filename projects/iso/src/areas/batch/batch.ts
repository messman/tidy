import { DateTime } from 'luxon';
import { enumKeys } from '../../utility';
import { SunEvent } from '../astro/astro-event';
import { CurrentTides, TideEventRange, TideExtremes } from '../tide';
import { DailyWeather, WeatherStatus } from '../weather';

export enum Seed {
	apple = 'apple',
	bronco = 'bronco',
	caesar = 'caesar',
	drum = 'drum',
	eggs = 'eggs',
	frost = 'frost',
	ginger = 'ginger',
	halo = 'halo',
}
export const seedKeys = enumKeys(Seed);

export interface BatchContent {
	/** Info about the request. */
	meta: Meta,
	/** Information about the current state of the location. */
	current: Current,
	/** Prediction data for the location. */
	predictions: Predictions,
	/** Daily-view information for the location. */
	daily: Daily;
}

export interface Meta {
	/** Time the request was processed on the server. */
	processingTime: DateTime,
	/** Matches to the configuration reference time. */
	referenceTime: DateTime,
	/** Time zone of all dates. */
	timeZone: string,
	/** Digits after the decimal for tide height. */
	tideHeightPrecision: number,
}

export interface Current {
	/** Current data about the tides. */
	tides: CurrentTides,
	/** Current data about the sunrise/sunset. */
	sun: {
		/** The previous astro sun event relative to now. */
		previous: SunEvent,
		/** The next astro sun event relative to now. */
		next: SunEvent;
	},
	/** The current weather information. */
	weather: WeatherStatus;
}

export interface Predictions {
	/** The cutoff date for all events in this area. Data may go past this point; implementations should check. Date will be an exact time. */
	cutoffDate: DateTime,
	/** Predictions for tides. */
	tides: TideEventRange;
	/** Predictions for sun events.  */
	sun: SunEvent[],
	/** Predictions for weather events. */
	weather: WeatherStatus[];
}

export interface Daily {
	/** The cutoff date for all events in this area. Data may go past this point; implementations should check. Date will be an exact time.  */
	cutoffDate: DateTime,
	/** Metadata for tides provided in 'today' and 'future'. */
	tideExtremes: TideExtremes,
	/** Information for each day from our reference time day to our cutoff date. */
	days: DailyDay[];
}

export interface DailyDay {
	/** The date. A day, but not a specific time. */
	date: DateTime,
	/** The weather event to describe the day. */
	weather: DailyWeather,
	/** Tide events for the day - includes events on the day before and the day after for continuity. */
	tides: TideEventRange,
	/** Sun events specific to the day. */
	sun: SunEvent[];
}