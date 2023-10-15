
export const constant = {

	/**
	 * The timezone to use. This should match the location from which we're fetching data - like for Maine,
	 * it will be America/New_York. 
	 * Implementations should take care of DST offsets.
	 */
	timeZoneLabel: 'America/New_York',

	/** Latitude used as part of sunrise/sunset calculation and weather lookup. */
	latitude: 43.301468,
	/** Longitude used as part of sunrise/sunset calculation and weather lookup. */
	longitude: -70.566169,

	/**
	 * NOAA stations, like https://tidesandcurrents.noaa.gov/stationhome.html?id=8419317
	 */
	tideStations: {
		/**
		   *  https://tidesandcurrents.noaa.gov/stationhome.html?id=8419317
		   */
		wells: 8419317,
		/**
		 * An alternative NOAA station, like https://tidesandcurrents.noaa.gov/stationhome.html?id=8418150
		 * in case the Wells station does not measure water level (it has a history of going down)
		 */
		portland: 8418150
	},

	beachAccess: {
		/*
			Note:

			We used to have different values for covered/uncovered for rising tide vs falling tide.
			This was meant to account for the velocity differences.
			This ended up causing issues in the logic for where we estimate changes in status
			of beach availability. Best to keep it the same heights regardless of direction.
		*/

		/**
		 * Our best guess of when the tide is at the top of the beach. We'll probably never get this right, because:
		 * 1. It's relative!
		 * 2. The height of the beach changes
		 * 3. Waves move the water up and down like a foot anyway
		 * 
		 * But, we'll use this for any diagrams / animations that need a hard number.
		*/
		bestGuessBeachHeight: 8.5,

		/**
		 * Our high-end guess for where water covers the beach.
		 * We are confident the beach is not accessible at this height.
		 * Above this is "covered", below this is "uncovering/covering".
		*/
		covered: 9.5,

		/**
		 * Our low-end guess for where water covers the beach.
		 * We are confident the beach is accessible up to this height.
		 * Above this is "covering/uncovering", below this is "uncovered".
		*/
		uncovered: 7,
	},

	/** Number of minutes before sunrise and after sunset where we can still have beach time. */
	sunLightBufferMinutes: 30
} as const;