import { hours, minutes, seconds } from '@messman/react-common';

export const CONSTANT = {

	/** Messages used to block the application. */
	alertMessages: [] as string[],

	/** Minimum time to wait for fetch response. */
	fetchMinTimeout: seconds(.2),
	/** Maximum time to wait for fetch response. */
	fetchMaxTimeout: seconds(20),
	/** Time before max where an update is shown to the user to reassure them. */
	fetchStillWaitingTimeout: seconds(10),
	/** Minimum time to wait for local data fetch response. */
	localTestDataMinTimeout: seconds(0),
	/** Time to wait since last successful fetch before automatically fetching again. */
	dataRefreshTimeout: minutes(10),

	elementSizeSmallThrottleTimeout: seconds(0),
	elementSizeLargeThrottleTimeout: seconds(0),

	clearDataOnNewFetch: false,

	/** Digits precision after the decimal on tide height. Overrides use of the AllResponse returned precision. */
	tideHeightPrecision: 1,

	/** Approximation of how many milliseconds pass between a high and low tide. */
	tidalHalfPeriod: hours(6) + minutes(12.5)
};

// Make these public on the window for us to easily check
(window as any)['CONSTANT'] = CONSTANT;