import { minutes, seconds } from '@messman/react-common';

export const CONSTANT = {

	/** Messages used to block the application. */
	alertMessages: [] as string[],

	/** Minimum time to wait for fetch response. */
	fetchMinTimeout: seconds(.5),
	/** Maximum time to wait for fetch response. */
	fetchMaxTimeout: seconds(20),
	/** Time before max where an update is shown to the user to reassure them. */
	fetchStillWaitingTimeout: seconds(10),
	/** Minimum time to wait for local data fetch response. */
	localTestDataMinTimeout: seconds(0),
	/** Time to wait since last successful fetch before automatically fetching again. */
	dataRefreshTimeout: minutes(8),
	/** If we need to data refresh and are coming back from a hidden state, this time acts as a buffer to avoid UI collisions. */
	dataRefreshVisibilityBuffer: seconds(1),

	elementSizeSmallThrottleTimeout: seconds(.1),
	elementSizeLargeThrottleTimeout: seconds(.2),

	clearDataOnNewFetch: false,

	/** Digits precision after the decimal on tide height. Overrides use of the AllResponse returned precision. */
	tideHeightPrecision: 1,
};

// Make these public on the window for us to easily check
(window as any)['CONSTANT'] = CONSTANT;