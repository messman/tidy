
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
		/** For saying "the beach is almost available" */
		fallingAlmostAccess: 8.5,
		/** The point at which water is exactly at the top of the beach. */
		beachTopHeight: 8,
		/** For saying "now there's enough beach to go out" */
		fallingTrueAccess: 7,
		/** Pristine "tons of beach" */
		fallingFullBeach: 3,
		/** Troubling "rising pretty fast" */
		risingQuickly: 3,
		/** For saying "beach is almost gone" */
		risingAlmostGone: 6,
	},

	/** Number of minutes before sunrise and after sunset where we can still have beach time. */
	sunLightBufferMinutes: 30
};