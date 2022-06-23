
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

	/** When the tide is at or below this height, the beach is accessible. */
	beachAccessHeight: 6.5,
};