import { DateTime } from 'luxon';
import { SunEvent } from '../astro/astro-event';
import { TideEventRange, TideExtremes } from '../tide/tide-event';
import { DailyWeather } from '../weather/weather-status';

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