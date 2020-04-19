export interface Info {
	/** Time the request was processed on the server. */
	processingTime: Date,
	/** Matches to the configuration reference time. */
	referenceTime: Date,
	/** Digits after the decimal for tide height. */
	tideHeightPrecision: number,
}