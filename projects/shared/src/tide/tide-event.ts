import { DateTime } from 'luxon';

export interface TideStatus<TDate = DateTime> {
	/** The time of the event. */
	time: TDate,
	/** The height, in feet. */
	height: number
}

export interface TideEvent<TDate = DateTime> extends TideStatus<TDate> {
	/** Whether the tide was low or not. */
	isLow: boolean
}

export interface TideExtremes<TDate = DateTime> {
	/** Event with the lowest height. Excludes outside events. */
	lowest: TideEvent<TDate>,
	/** Event with the highest height. Excludes outside events. */
	highest: TideEvent<TDate>
}

export interface TideEventRange<TDate = DateTime> extends TideExtremes<TDate> {
	/** Events in the range, in order by date from earliest to latest. **/
	events: TideEvent<TDate>[]
	/** For continuity in graphing. */
	outsidePrevious: TideEvent<TDate> | null,
	/** For continuity in graphing. */
	outsideNext: TideEvent<TDate> | null
}