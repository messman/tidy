import { DateTime } from 'luxon';

export interface Info<TDate = DateTime> {
	/** Time the request was processed on the server. */
	processingTime: TDate,
	/** Matches to the configuration reference time. */
	referenceTime: TDate,
	/** Time zone of all dates. */
	timeZone: string,
	/** Digits after the decimal for tide height. */
	tideHeightPrecision: number,
}