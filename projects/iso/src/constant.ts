
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
		/**
		 * Our best guess of when the tide is at the top of the beach. We'll probably never get this right, because:
		 * 1. It's relative!
		 * 2. The height of the beach changes
		 * 3. Waves move the water up and down like a foot anyway
		 * 
		 * But, we'll use this for any diagrams / animations that need a hard number.
		*/
		bestGuessBeachHeight: 7.5,
		/** Marks the start of the "uncovering" status. For our logic, this is outside the beach time. */
		uncoveringStart: 8.5,
		/** Marks the end of the "uncovering" status. For our logic, this is when we are most confident that beach time is on. */
		uncoveringStop: 7,
		/**
		 * Marks the start of the "covering" status. For our logic, this is when we are confident we should no longer consider it beach time
		 * It's a bit lower than other numbers because the tide rises pretty quick + we don't want people to think they have more time to head out
		 * to the beach when they really don't.
		 */
		coveringStart: 6,
		/**
		 * Marks the end of the "covering" status. For our logic this is when we are confident there is no way to step foot on that beach.
		 */
		coveringStop: 8,
	},

	/** Number of minutes before sunrise and after sunset where we can still have beach time. */
	sunLightBufferMinutes: 30
};