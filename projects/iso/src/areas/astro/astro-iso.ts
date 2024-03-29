import { DateTime } from 'luxon';

export enum AstroSolarEventType {
	civilDawn,
	rise,
	midday,
	set,
	civilDusk
}

/** A simplified version of {@link AstroSolarEvent} */
export interface AstroSunRiseSet {
	/** Points to the real solar event. */
	id: string;
	time: DateTime;
	isSunrise: boolean;
}

export interface AstroSolarEvent {
	id: string;
	/** The time of the astro event. */
	time: DateTime,
	type: AstroSolarEventType;
}

export interface AstroSunDay {
	civilDawnId: string;
	riseId: string;
	middayId: string;
	setId: string;
	civilDuskId: string;
}

// /** As in, viewed from the Earth in one place. */
// export interface AstroLunarDay {
// 	/** May be on a different day than set. */
// 	rise: DateTime;
// 	/** May be on a different day than rise. */
// 	set: DateTime;
// }

export interface AstroDay {
	time: DateTime;
	sun: AstroSunDay;
	/** Moon phase is assumed to be at noon because we have no specifics. */
	moon: AstroLunarPhase;
}

export interface AstroLunarFuture {
	/** The date (day) of this phase of note. */
	time: DateTime;
	/** The phase of note - either new or full. */
	phase: AstroLunarPhase;
	/** Indicates whether the phase above is starting or ending. */
	isStart: boolean;
}

export interface AstroLunarPhaseDay {
	/** Start of the day. */
	time: DateTime;
	/** Moon phase is assumed to be at noon because we have no specifics. */
	moon: AstroLunarPhase;
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