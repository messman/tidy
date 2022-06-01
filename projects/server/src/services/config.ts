import { DateTime } from 'luxon';
import { dateForZone } from './time';

export interface BaseInput {
	/** Latitude used as part of sunrise/sunset calculation and weather lookup. */
	latitude: number,
	/** Longitude used as part of sunrise/sunset calculation and weather lookup. */
	longitude: number,
	/**
	 * The timezone to use. This should match the location from which we're fetching data - like for Maine,
	 * it will be America/New_York. 
	 * Implementations should take care of DST offsets.
	 */
	timeZoneLabel: string;

	/**
	 * Time to make all requests based off of. Should probably be "now", and that may be all that's supported for now.
	 */
	referenceTime: Date,

	/**
	 * Number of hours into the future to grab short-term data (data that shows in our scrolling data view).
	 * Does not go to the end of the day.
	 */
	shortTermDataFetchHours: number,
	/**
	 * Number of days into the future to grab long-term data (data that shows in our long-term view).
	 * So if 7, adds 7 days and goes to end of that day.
	 * Should be longer than short-term date.
	 */
	longTermDataFetchDays: number;
}

export interface BaseLive {
	/** Time of the request, from which all searches will be relatively based. Adjusted to proper timezone. Includes DST offset. */
	referenceTimeInZone: DateTime,

	/** The maximum date for which we should get any data for short term information. Should be in the future but does not need to be the end of the day. */
	maxShortTermDataFetch: DateTime,
	/** The maximum date for which we should get any data for long term information. Should be in the future at the end of that day. */
	maxLongTermDataFetch: DateTime,
}

export function createBaseLive(baseInput: BaseInput): BaseLive {
	// Associate the time with the location.
	const referenceTime = dateForZone(baseInput.referenceTime, baseInput.timeZoneLabel);

	return {
		referenceTimeInZone: referenceTime,

		// Use that day, but note you may have to translate to 'beginning of next day' for some logic.
		maxShortTermDataFetch: referenceTime.plus({ hours: baseInput.shortTermDataFetchHours }),
		maxLongTermDataFetch: referenceTime.plus({ days: baseInput.longTermDataFetchDays }).endOf("day"),
	};
}

export interface BaseConfig {
	input: BaseInput;
	live: BaseLive;
}