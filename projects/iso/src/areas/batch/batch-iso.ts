import { DateTime } from 'luxon';
import { enumKeys } from '../../utility';
import * as Astro from '../astro';
import * as Tide from '../tide';
import * as Weather from '../weather';

export enum Seed {
	avocado = 'avocado',
	banana = 'banana',
	cheerio = 'cheerio',
	durian = 'durian',
	ember = 'ember',
	frosting = 'frosting',
	ginger = 'ginger',
	hamburger = 'hamburger',
	icing = 'icing',
	juice = 'juice',
	knife = 'knife',
	lemon = 'lemon',
	meat = 'meat',
	nacho = 'nacho',
	oreo = 'oreo'
}
export const seedKeys = enumKeys(Seed);

export interface BatchContent {
	/** Info about the request. */
	meta: Meta;
	/** Content used mainly for the beach time representation. */
	beach: BeachContent;
	/** Content related to sun and moon. */
	astro: AstroContent;
	/** Content for weather, including both hourly and daily. */
	weather: WeatherContent;
	/** Content for tides, including current and predictions. */
	tide: TideContent;
}

export interface Meta {
	/** Time the request was processed on the server. */
	processingTime: DateTime;
	/** Matches to the configuration reference time. */
	referenceTime: DateTime;
}

export interface BeachContent {
	/** Whether or not it is beach time, and whether or not it is best. */
	status: BeachTimeStatus;
	/** First reason for fully stopping current beach time. */
	firstStopReason: BeachTimeReason | null;
	tide: BeachTimeCurrentTide;
	sun: BeachTimeCurrentSun;
	weather: BeachTimeCurrentWeather;

	/** The next beach time that users can expect. */
	next: BeachTimeRange;
	/** Beach times by day for the next few days. */
	days: BeachTimeDay[];
}

export interface BeachTimeDay {
	/** The day, likely without time. */
	day: DateTime;
	/** Weather information for the day. */
	weather: Weather.Day;
	/** Astro events for the day. */
	astro: Astro.Day;
	/** Low tides for the day. */
	tideLows: Tide.ExtremeStamp[];
	/** Ranges, if any. */
	ranges: BeachTimeRange[];
}

export interface BeachTimeRange {
	/** When the beach time begins. */
	start: DateTime;
	/** When the beach time ends. */
	stop: DateTime;
	/** Blocks of time broken up by whether they are best. */
	blocks: BeachTimeBlock[];
}

export interface BeachTimeBlock {
	/** Whether this is a time when all parts are in their best state. */
	isBest: boolean;
	/** When this block starts. */
	start: DateTime,
	/** When this block stops. */
	stop: DateTime,
}

export interface BeachTimeCurrentTide {
	beachTimeStatus: BeachTimeStatus;
	tideMarkStatus: BeachTimeTideMarkStatus;
}

export interface BeachTimeTideMark {
	time: DateTime;
	heightStatus: BeachTimeTideMarkStatus;
}

export enum BeachTimeTideMarkStatus {
	/** The bare minimum beach is becoming available. */
	earlyFall,
	/** The beach is as available as it needs to be for beach time. */
	fullyFall,
	/** The beach is at the first point of concern for rising. */
	earlyRise,
	/** The beach has risen past the point where beach is available. */
	fullyRise
}

export interface BeachTimeCurrentSun {
	beachTimeStatus: BeachTimeStatus;
	sunMarkStatus: BeachTimeSunMarkStatus;
}

export interface BeachTimeSunMark {
	time: DateTime;
	lightStatus: BeachTimeSunMarkStatus;
}

export enum BeachTimeSunMarkStatus {
	/** The sun has set, but there is still light. */
	sunset,
	/** It is too dark for the beach. */
	night,
	/** The sun has not yet risen, but there is light. */
	predawn,
	/** The sun has risen. */
	sunrise
}

export interface BeachTimeCurrentWeather {
	beachTimeStatus: BeachTimeStatus;
	weatherMarkStatus: Weather.Indicator;
}

export interface BeachTimeWeatherMark {
	time: DateTime;
	weatherStatus: Weather.Indicator;
}

export enum BeachTimeStatus {
	not,
	okay,
	best
}

/** A reason can be due to tides, sun, or weather. */
export type BeachTimeReason = BeachTimeTideMark | BeachTimeWeatherMark | BeachTimeSunMark;

export function isBeachTimeTideMark(value: BeachTimeReason | null): value is BeachTimeTideMark {
	return !!value && (value as BeachTimeTideMark).heightStatus !== undefined;
}
export function isBeachTimeSunMark(value: BeachTimeReason | null): value is BeachTimeSunMark {
	return !!value && (value as BeachTimeSunMark).lightStatus !== undefined;
}
export function isBeachTimeWeatherMark(value: BeachTimeReason | null): value is BeachTimeWeatherMark {
	return !!value && (value as BeachTimeWeatherMark).weatherStatus !== undefined;
}

export interface AstroContent {
	sun: {
		relativity: Astro.SunRelativity;
		yesterday: Astro.SunDay;
		today: Astro.SunDay;
		tomorrow: Astro.SunDay;
	};
	moon: {
		/** Next event, rise or set. */
		next: Astro.BodyEvent;
		/** Next connected rise and set (rise before set). May cross Earth days. */
		nextLunarDay: Astro.LunarDay;
	};
}

export interface WeatherContent {
	/** Current weather. */
	current: WeatherContentCurrent;
	/** Hourly weather for some time. */
	hourly: WeatherContentHourly[];
}

export interface WeatherContentCurrent extends Weather.Current {
	/** Whether it's daytime or not. */
	isDaytime: boolean;
}

export interface WeatherContentHourly extends Weather.Hourly {
	/** Whether it's daytime or not. */
	isDaytime: boolean;
}

export interface TideContent {
	/** The true measured tide level. */
	measured: Tide.MeasureStamp;
	relativity: Tide.Relativity;
	daily: TideContentDay[];
	/** The minimum across all included in the daily array. */
	dailyMin: Tide.ExtremeStamp;
	/** The maximum across all included in the daily array. */
	dailyMax: Tide.ExtremeStamp;
}

export interface TideContentDay {
	extremes: Tide.ExtremeStamp[];
	moonPhase: Astro.MoonPhase;
}