export const CONSTANT = {

	/** Messages used to block the application. */
	alertMessages: [] as string[],

	/** Minimum time to wait for fetch response. */
	fetchMinTimeout: seconds(.5),
	/** Maximum time to wait for fetch response. */
	fetchMaxTimeout: seconds(15),
	/** Minimum time to wait for local data fetch response. */
	localTestDataMinTimeout: seconds(0),
	/** Expiration timeout for a success. */
	cacheExpirationTimeout: minutes(4),

	elementSizeThrottleTimeout: seconds(.3),
};

function seconds(seconds: number): number {
	return seconds * 1000;
}

function minutes(minutes: number): number {
	return seconds(minutes * 60);
}

// Make these public on the window for us to easily check
(window as any)['CONSTANT'] = CONSTANT;