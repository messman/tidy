export const CONSTANT = {

	/** Messages used to block the application. */
	alertMessages: [] as string[],

	/** Minimum time to wait for fetch response. */
	fetchMinTimeout: seconds(.5),
	/** Maximum time to wait for fetch response. */
	fetchMaxTimeout: seconds(36),
	/** Time before max where an update is shown to the user to reassure them. */
	fetchStillWaitingTimeout: seconds(15),
	/** Minimum time to wait for local data fetch response. */
	localTestDataMinTimeout: seconds(0),
	/** Expiration timeout for a success. */
	cacheExpirationTimeout: minutes(4),

	elementSizeSmallThrottleTimeout: seconds(.1),
	elementSizeLargeThrottleTimeout: seconds(.2),

	clearDataOnNewFetch: false,

	/** Digits precision after the decimal on tide height. Overrides use of the AllResponse returned precision. */
	tideHeightPrecision: 1,
};

function seconds(seconds: number): number {
	return seconds * 1000;
}

function minutes(minutes: number): number {
	return seconds(minutes * 60);
}

// Make these public on the window for us to easily check
(window as any)['CONSTANT'] = CONSTANT;