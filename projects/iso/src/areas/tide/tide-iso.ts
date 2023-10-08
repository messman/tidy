import { DateTime } from 'luxon';

export interface TidePoint {
	time: DateTime;
	height: number;
}

/** Division of a tide, used primarily for UI. */
export enum TideLevelDivision {
	/** Lower third. */
	low,
	/** Middle third. */
	mid,
	/** Upper third. */
	high
}

/** The direction of the tides. */
export enum TideLevelDirection {
	rising,
	turning,
	falling
}

export interface TidePointFromExtremes {
	time: DateTime;
	height: number;
	previousExtreme: TidePointExtreme;
	nextExtreme: TidePointExtreme;
}

/**
 * A measurement/estimation of the tides at a given time.
 * Does not contain information that has to be gleaned from surrounding context (his and lows).
*/
export interface TidePointCurrentSource {
	/**
	 * Portland data, if available. If we have it, it's the only observation data we can go off of!
	*/
	portland: TidePoint | null;
	/** How much we decided to adjust the Portland value by to compensate for time and distance. */
	portlandAdjustment: number | null;
	/**
	 * Computed by using time to check between the portland astro data.
	*/
	portlandComputed: TidePointFromExtremes | null;
	/**
	 * Computed by using time to check between the computed astro/ofs extremes. Likely inaccurate at the extremes.
	*/
	computed: TidePointFromExtremes;
	/** 
	 * Computed by using time to check between the astronomical extremes. Likely inaccurate at the extremes.
	 */
	astroComputed: TidePointFromExtremes;
	/**
	 * Computed from the water level interval data.
	 */
	ofsInterval: TidePoint;
	/**
	 * Computed by using time to check between the ofs extremes. Likely inaccurate at the extremes.
	*/
	ofsComputed: TidePointFromExtremes;
	/** The time the forecast was created. */
	ofsEntryTimeUtc: DateTime;
	/** The number of retries to find forecast data. */
	ofsRetries: number;
	/** The station the water level and extremes are forecasted for. */
	ofsStation: { lat: number; lon: number; };
	/** A quick approximation of how many meters away the forecasted station is from our ideal coordinates. In kilometers. */
	ofsOffset: number;
}

/** The current tide level. */
export interface TidePointCurrent {
	/** The height we want to say is the current height right now. Likely computed from multiple sources. */
	height: number;
	/** high, medium, or low (thirds). Not whether it's currently a high or low. */
	division: TideLevelDivision;
	/** Direction depending on surrounding extremes. */
	direction: TideLevelDirection;
	/** An indication of whether the beach is covered, including the "fuzzy" time in-between. */
	beachStatus: TideLevelBeachStatus;
	/** When the beach is going to be covered / uncovered next compared to right now. */
	beachChange: DateTime;
}

/** This is a span of time, not a specific point in time. */
export enum TideLevelBeachStatus {
	/** Solidly uncovered. */
	uncovered = 1,
	/** In that fuzzy covering/uncovering time. */
	between,
	/** Solidly covered. */
	covered,
}

export interface TidePointExtreme {
	id: string;
	time: DateTime;
	height: number;
	isLow: boolean;
}

export interface TidePointExtremeComp extends TidePointExtreme {
	/** Astronomical extreme data (not accounting for weather) */
	astro: TidePoint;
	/** OFS extreme data (attempting to account for weather). Null if outside what GoMOFS provides. */
	ofs: TidePoint | null;
}

export interface TidePointExtremeDay {
	time: DateTime;
	previousId: string;
	extremaIds: string[];
	nextId: string;
}