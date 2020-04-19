export interface TideStatus {
	/** The time of the event. */
	time: Date,
	/** The height, in feet. */
	height: number
}

export interface TideEvent extends TideStatus {
	/** Whether the tide was low or not. */
	isLow: boolean
}

export interface TideExtremes {
	/** Event with the lowest height. Excludes outside events. */
	lowest: TideEvent,
	/** Event with the highest height. Excludes outside events. */
	highest: TideEvent
}

export interface TideEventRange extends TideExtremes {
	/** Events in the range, in order by date from earliest to latest. **/
	events: TideEvent[]
	/** For continuity in graphing. */
	outsidePrevious: TideEvent | null,
	/** For continuity in graphing. */
	outsideNext: TideEvent | null
}