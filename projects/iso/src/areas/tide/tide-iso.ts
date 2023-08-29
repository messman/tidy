import { DateTime } from 'luxon';

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

/**
 * A measurement/estimation of the tides at a given time.
 * Does not contain information that has to be gleaned from surrounding context (his and lows).
*/
export interface TidePointCurrent {
	/** Whether we had to grab water level from the backup location. */
	isAlternate: boolean;
	/**
	 * We can always compute a height, so make it available always.
	 * While the measured height may be significantly in the past, this computed value
	 * is for the reference time.
	*/
	computed: number;
	/** Whether the water level is the computed value. */
	isComputed: boolean;
	/** Could be up to 30 minutes behind, based on when measurement was taken! */
	time: DateTime;
	/** Always a value, but may be the computed value. May not be precise to this time. */
	height: number;
}

/** Additional information for the current level that depends on surrounding context. */
export interface TidePointCurrentContextual extends TidePointCurrent {
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
	/** Solidly covered. */
	covered = 1,
	/** In that fuzzy uncovering time. */
	uncovering,
	/** Solidly uncovered. */
	uncovered,
	/** In that fuzzy covering time. */
	covering
}

export interface TidePointExtreme {
	id: string;
	time: DateTime;
	height: number,
	isLow: boolean;
}