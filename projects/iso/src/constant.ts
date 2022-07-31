
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
	 * NOAA station, like https://tidesandcurrents.noaa.gov/stationhome.html?id=8419317
	 */
	tideStation: 8419317,

	/**
	 * An alternative NOAA station, like https://tidesandcurrents.noaa.gov/stationhome.html?id=8418150
	 * in case the Wells station does not measure water level (it has a history of going down)
	 */
	portlandTideStation: 8418150,

	/** When beach time is no longer best. */
	beachAccessEarlyRise: 5,
	/** When beach time is over. */
	beachAccessFullyRise: 7.5,
	/** When beach time starts but is not best. */
	beachAccessEarlyFall: 8,
	/** When beach time is best. */
	beachAccessFullyFall: 7,

	/** Number of minutes before sunrise and after sunset where we can still have beach time. */
	sunLightBufferMinutes: 30,
};