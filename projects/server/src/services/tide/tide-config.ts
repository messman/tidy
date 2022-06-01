import { DateTime } from 'luxon';
import { BaseConfig } from '../config';

export interface TideInput {
	/**
	 * NOAA station, like https://tidesandcurrents.noaa.gov/stationhome.html?id=8419317
	 */
	station: number,

	/**
	 * Number of days in the past to look for tides.
	 * So if 2, subtracts 2 days and then goes to the beginning of that day.
	 */
	daysInPastToFetchTides: number,

	/** Digits after the decimal to include in height measurements. */
	tideHeightPrecision: number,
}

export interface TideLive {
	/**
	 * The minimum date to get tides data for. Should be in the past, at least one day, at the beginning of that day.
	 * Based on configuration and time of request.
	 */
	minimumTidesDataFetch: DateTime;
}

export function createTideLive(baseConfig: BaseConfig, tideInput: TideInput): TideLive {
	return {
		minimumTidesDataFetch: baseConfig.live.referenceTimeInZone.minus({ days: tideInput.daysInPastToFetchTides }).startOf("day"),
	};
}

export interface TideConfig {
	base: BaseConfig;
	tide: {
		input: TideInput;
		live: TideLive;
	};
}