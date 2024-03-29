import { DateTime } from 'luxon';

export interface BaseInput {
	/**
	 * Time to make all requests based off of. Should probably be "now", and that may be all that's supported for now.
	 */
	referenceTime: DateTime,

	/**
	 * Number of days into the future to grab long-term data (data that shows in our long-term view).
	 * So if 7, adds 7 days and goes to end of that day.
	 * Used for both short and long-term tide UI.
	 */
	futureDays: number,
}

export interface BaseLiveConfig {
	/** Time of the request, from which all searches will be relatively based. Adjusted to proper timezone. Includes DST offset. */
	referenceTime: DateTime,

	/** The maximum date for which we should get any data. End of that day. */
	futureCutoff: DateTime,
}

export function createBaseLiveConfig(baseInput: BaseInput): BaseLiveConfig {
	const referenceTime = baseInput.referenceTime;
	return {
		referenceTime: referenceTime,

		futureCutoff: referenceTime.plus({ days: baseInput.futureDays }).endOf("day")
	};
}

export interface BaseConfig extends BaseLiveConfig {
	input: BaseInput;

}