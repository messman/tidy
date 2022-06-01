import { DateTime } from 'luxon';
import { BaseConfig } from '../config';

export interface AstroInput {
	/**
	 * Number of days in the past to look for sunrise/sunset data.
	 * So if 2, subtracts 2 days and then goes to the beginning of that day.
	 */
	daysInPastToFetchSun: number,
}

export interface AstroLive {
	/**
	 * The minimum date to get sunrise/sunset data for. Should be in the past, at least one day, at the beginning of that day.
	 * Based on configuration and time of request.
	 */
	minimumSunDataFetch: DateTime;
}

export function createAstroLive(baseConfig: BaseConfig, astroInput: AstroInput): AstroLive {
	return {
		minimumSunDataFetch: baseConfig.live.referenceTimeInZone.minus({ days: astroInput.daysInPastToFetchSun }).startOf("day"),
	};
}

export interface AstroConfig {
	base: BaseConfig;
	astro: {
		input: AstroInput;
		live: AstroLive;
	};
}