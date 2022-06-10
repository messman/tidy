import { DateTime } from 'luxon';

/** Division of a tide, used primarily for UI. */
export enum Division {
	/** Lower third. */
	low,
	/** Middle third. */
	mid,
	/** Upper third. */
	high
}

/** The direction of the tides. */
export enum Direction {
	rising,
	turning,
	falling
}

/** A measurement/estimation of the tides at a given time. */
export interface Stamp {
	time: DateTime;
	height: number,
	division: Division;
	direction: Direction;
}

export interface ExtremeStamp {
	time: DateTime;
	height: number,
	isLow: boolean;
}

export interface Relativity {
	previous: ExtremeStamp;
	/** May be set if we are "close enough" to a tide extreme. */
	current: ExtremeStamp | null;
	next: ExtremeStamp;
}