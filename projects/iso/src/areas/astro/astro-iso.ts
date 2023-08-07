import { DateTime } from 'luxon';

export interface AstroBodyEvent {
	/** The time of the astro event. */
	time: DateTime,
	/** Whether or not the event is a rise (otherwise, it's a set). */
	isRise: boolean;
}

export interface AstroSunDay {
	rise: DateTime;
	set: DateTime;
}

/** As in, viewed from the Earth in one place. */
export interface AstroLunarDay {
	/** May be on a different day than set. */
	rise: DateTime;
	/** May be on a different day than rise. */
	set: DateTime;
}

export interface AstroDay {
	sun: AstroSunDay;
	/** Moon phase is assumed to be at noon because we have no specifics. */
	moon: AstroLunarPhase;
}

export interface AstroLunarPhaseDay {
	/** Start of the day. */
	time: DateTime;
	/** Moon phase is assumed to be at noon because we have no specifics. */
	moon: AstroLunarPhase;
}

export interface AstroSunRelativity {
	previous: AstroBodyEvent;
	/** May be set if we are close enough to a sun event. */
	current: AstroBodyEvent | null;
	next: AstroBodyEvent;
}

export enum AstroLunarPhase {
	/** New Moon */
	a_new,
	/** Waxing Crescent */
	b_waxingCrescent,
	/** First Quarter */
	c_firstQuarter,
	/** Waxing Gibbous */
	d_waxingGibbous,
	/** Full Moon */
	e_full,
	/** Waning Gibbous */
	f_waningGibbous,
	/** Third Quarter */
	g_thirdQuarter,
	/** Waning Crescent */
	h_waningCrescent
}