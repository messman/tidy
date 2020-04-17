export interface TideEvent {
	/** The time of the event. */
	time: Date,
	/** Whether the tide was low or not. */
	isLow: boolean,
	/** The height, in feet. */
	height: number
}