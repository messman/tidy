import { DateTime } from "luxon";

export interface APIConfiguration {
	configuration: {
		/**
		 * The timezone to use. This should match the location from whcih we're fetching data - like for Maine,
		 * it will be America/New_York. We will serialize the DateTime data into a string that is in this timezone 
		 * so that client data will show the right time.
		 * Also affects fetches for data tat revolve around time.
		 * Includes the DST offset!
		 */
		timeZoneLabel: string,

		/**
		 * Number of days into the future to grab short-term data (data that shows in our scrolling data view).
		 * So if 3, adds 3 days and goes to end of that day.
		 * Should be shorter than long-term date.
		 */
		shortTermDataFetchDays: number,
		/**
		 * Number of days into the future to grab long-term data (data that shows in our long-term view).
		 * So if 7, adds 7 days and goes to end of that day.
		 * Should be longer than short-term date.
		 */
		longTermDataFetchDays: number


		tides: {
			/**
			 * Number of days in the past to look for tides.
			 * So if 2, subtracts 2 days and then goes to the beginning of that day.
			 */
			daysInPastToFetchTides: number
		},

		weather: {
			/** The gap in hours between weather data - so we aren't grabbing more data than we need from the API to send down to a client that can't show it. */
			hoursGapBetweenWeatherData: number
		}
	}
}

const defaultAPIConfiguration: APIConfiguration = {
	configuration: {
		timeZoneLabel: "America/New_York", // Matches Wells, Maine
		shortTermDataFetchDays: 3,
		longTermDataFetchDays: 7,
		tides: {
			daysInPastToFetchTides: 1
		},
		weather: {
			hoursGapBetweenWeatherData: 3
		}
	}
}

export interface APIConfigurationContext extends APIConfiguration {
	context: {

		/** Time of the request, from which all searches will be relatively based. Adjusted to proper timezone. Includes DST offset. */
		timeOfRequest: DateTime,

		/** The maximum date for which we should get any data for short term information. Should be in the future at the end of that day. */
		maxShortTermDataFetch: DateTime,
		/** The maximum date for which we should get any data for long term information. Should be in the future at the end of that day. */
		maxLongTermDataFetch: DateTime,

		tides: {
			/**
			 * The minimum date to get tides data for. Should be in the past, at least one day, at the beginning of that day.
			 * Based on configuration and time of request.
			 */
			minimumTidesDataFetch: DateTime
		},

		weather: {
		}
	}
}

/**
 * Creates a request context. Currently creates the 'time of request' within.
 */
export function createContext(configuration: APIConfiguration): APIConfigurationContext {
	// TODO: log this or adjust to always use this configuration or otherwise not use this automatically.
	const cfg = (configuration || defaultAPIConfiguration);
	const cfgi = cfg.configuration;
	const cctx = cfg as APIConfigurationContext;

	// TODO - maybe move this out?
	const now = DateTime.local().setZone(cfgi.timeZoneLabel);

	cctx.context = {
		timeOfRequest: now,

		// Use start of next day, instead of "23:59:99...", so add 1 to the value.
		maxShortTermDataFetch: now.plus({ days: cfgi.shortTermDataFetchDays + 1 }).startOf("day"),
		maxLongTermDataFetch: now.plus({ days: cfgi.longTermDataFetchDays + 1 }).startOf("day"),

		tides: {
			minimumTidesDataFetch: now.minus({ days: cfgi.tides.daysInPastToFetchTides }).startOf("day"),
		},

		weather: {
		}
	};

	return cctx;
};