import { minutes, seconds } from '@messman/react-common';

export const CONSTANT = {

	/** Minimum time to wait for fetch response. */
	fetchMinTimeout: seconds(.2),
	/** Maximum time to wait for fetch response. */
	fetchMaxTimeout: seconds(25),

	/** Time before max where an update is shown to the user to reassure them. */
	fetchStillWaitingTimeout: seconds(8),

	/** Time to wait since last successful fetch before either fetching again or restarting the application. */
	appRefreshTimeout: minutes(4),

	elementSizeSmallThrottleTimeout: seconds(0),
	elementSizeLargeThrottleTimeout: seconds(0),
} as const;

// Make these public on the window for us to easily check
(window as any)['CONSTANT'] = CONSTANT;