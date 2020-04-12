export interface AstroEvent {
	/** The time of the astro event. */
	time: Date,
}

export interface SunEvent extends AstroEvent {
	/** Whether or not the event is a sunrise (otherwise, it's a sunset). */
	isSunrise: boolean
}