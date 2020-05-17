import { DateTime } from "luxon";

export interface APIConfiguration {
	configuration: {
		location: {
			/** Latitude used as part of sunrise/sunset calculation and weather lookup. */
			latitude: number,
			/** Longitude used as part of sunrise/sunset calculation and weather lookup. */
			longitude: number,
			/**
			 * The timezone to use. This should match the location from which we're fetching data - like for Maine,
			 * it will be America/New_York. 
			 * Implementations should take care of DST offsets.
			 */
			timeZoneLabel: string
		},

		time: {
			/**
			 * Time to make all requests based off of. Should probably be "now", and that may be all that's supported for now.
			 */
			referenceTime: Date,

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
		}

		tides: {
			/**
			 * NOAA station, like https://tidesandcurrents.noaa.gov/stationhome.html?id=8419317
			 */
			station: number,

			/**
			 * Number of days in the past to look for tides.
			 * So if 2, subtracts 2 days and then goes to the beginning of that day.
			 */
			daysInPastToFetchTides: number,

			/** Digits after the decimal to include in height measurements. */
			tideHeightPrecision: number,
		},

		astro: {
			/**
			 * Number of days in the past to look for sunrise/sunset data.
			 * So if 2, subtracts 2 days and then goes to the beginning of that day.
			 */
			daysInPastToFetchSun: number,
		},

		weather: {
			/** The gap in hours between weather data - so we aren't grabbing more data than we need from the API to send down to a client that can't show it. */
			hoursGapBetweenWeatherData: number,
			/** Digits after the decimal to include in temperature measurements. */
			temperaturePrecision: number,
			/** Digits after the decimal to include in other non-temperature measurements. */
			defaultPrecision: number,
		}
	}
}

export interface APIConfigurationContext extends APIConfiguration {
	context: {
		/** Time of the request, from which all searches will be relatively based. Adjusted to proper timezone. Includes DST offset. */
		referenceTimeInZone: DateTime,

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

		astro: {
			/**
			 * The minimum date to get sunrise/sunset data for. Should be in the past, at least one day, at the beginning of that day.
			 * Based on configuration and time of request.
			 */
			minimumSunDataFetch: DateTime
		}
	},
	action: {
		parseDateForZone(date: Date): DateTime
	}
}

/**
 * Creates a request context. Currently creates the 'time of request' within.
 */
export function createContext(apiConfiguration: APIConfiguration): APIConfigurationContext {
	if (!apiConfiguration) {
		throw new Error('no configuration provided');
	}
	const configuration = apiConfiguration.configuration;
	const configurationContext = apiConfiguration as APIConfigurationContext;

	function parseDateForZone(date: Date): DateTime {
		// https://moment.github.io/luxon/docs/manual/zones.html
		return DateTime.fromJSDate(date).setZone(configuration.location.timeZoneLabel);
	}

	// Associate the time with the location.
	const referenceTime = parseDateForZone(configuration.time.referenceTime);

	configurationContext.context = {
		referenceTimeInZone: referenceTime,

		// Use that day, but note you may have to translate to 'beginning of next day' for some logic.
		maxShortTermDataFetch: referenceTime.plus({ days: configuration.time.shortTermDataFetchDays }).endOf("day"),
		maxLongTermDataFetch: referenceTime.plus({ days: configuration.time.longTermDataFetchDays }).endOf("day"),

		tides: {
			minimumTidesDataFetch: referenceTime.minus({ days: configuration.tides.daysInPastToFetchTides }).startOf("day"),
		},

		astro: {
			minimumSunDataFetch: referenceTime.minus({ days: configuration.astro.daysInPastToFetchSun }).startOf("day"),
		}
	};
	configurationContext.action = {
		parseDateForZone: parseDateForZone
	}

	return configurationContext;
};