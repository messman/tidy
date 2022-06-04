import { DateTime } from 'luxon';

export enum TideDivision {
	low,
	mid,
	high
}

export enum TideDirection {
	rising,
	stable,
	falling
}

export interface CurrentTide {
	height: number,
	division: TideDivision;
	direction: TideDirection;
}

export interface CurrentTides {
	/** The height, in feet. */
	height: number,
	/** The range of tides - will always have two events - previous and next. */
	range: TideEventRange;
}

export interface TideStatus {
	/** The time of the event. */
	time: DateTime,
	/** The height, in feet. */
	height: number;
}

export interface TideEvent extends TideStatus {
	/** Whether the tide was low or not. */
	isLow: boolean;
}

export interface TideExtremes {
	/** Event with the lowest height. Excludes outside events. */
	lowest: TideEvent,
	/** Event with the highest height. Excludes outside events. */
	highest: TideEvent;
}

export interface TideEventRange extends TideExtremes {
	/** Events in the range, in order by date from earliest to latest. **/
	events: TideEvent[];
	/** For continuity in graphing - in order by date from earliest to latest */
	outsidePrevious: TideEvent[],
	/** For continuity in graphing - in order by date from earliest to latest */
	outsideNext: TideEvent[];
}