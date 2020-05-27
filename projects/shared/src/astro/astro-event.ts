import { DateTime } from 'luxon';

export interface AstroEvent<TDate = DateTime> {
	/** The time of the astro event. */
	time: TDate,
}

export interface SunEvent<TDate = DateTime> extends AstroEvent<TDate> {
	/** Whether or not the event is a sunrise (otherwise, it's a sunset). */
	isSunrise: boolean
}