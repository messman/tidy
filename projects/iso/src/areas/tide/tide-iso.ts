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
 * Note - this information is not always guaranteed accurate or from the right location.
 */
export interface TidePointBase {
	/** Whether we had to grab water level from the backup location. */
	isAlternate: boolean;
	/** Whether the water level is the computed value. */
	isComputed: boolean;
	/**
	 * We can always compute a height, so make it available always.
	 * While the measured height may be significantly in the past, this computed value
	 * is for the reference time.
	*/
	computed: number;
	/** Could be up to 30 minutes behind, based on when measurement was taken! */
	time: DateTime;
	/** Always a value, but may be the computed value. May not be precise to this time. */
	height: number;
}

/**
 * A measurement/estimation of the tides at a given time.
 */
export interface TidePoint extends TidePointBase {
	division: TideLevelDivision;
	direction: TideLevelDirection;
}

export interface TidePointExtreme {
	time: DateTime;
	height: number,
	isLow: boolean;
}

export interface TideRelativity {
	previous: TidePointExtreme;
	/** May be set if we are "close enough" to a tide extreme. */
	current: TidePointExtreme | null;
	next: TidePointExtreme;
}