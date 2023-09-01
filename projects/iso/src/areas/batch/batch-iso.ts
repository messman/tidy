import { DateTime } from 'luxon';
import { enumKeys } from '../../utility/enum';
import { AstroDay, AstroLunarPhase, AstroSolarEvent, AstroSunDay } from '../astro/astro-iso';
import { TidePointCurrentContextual, TidePointExtreme, TidePointExtremeDay } from '../tide/tide-iso';
import { WeatherIndicator, WeatherPointCurrent, WeatherPointDaily, WeatherPointHourly } from '../weather/weather-iso';

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

export interface Batch {
	/** Info about the request. */
	meta: BatchMeta;

	/** Tide extrema data, which is referenced in multiple areas. */
	tideExtrema: {
		extrema: TidePointExtreme[];
		minId: string;
		maxId: string;
	};
	solarEvents: AstroSolarEvent[];

	/** Content for the current situation. */
	now: BatchNow;
	/** Content for the upcoming week. */
	week: BatchWeek;
}

export interface BatchMeta {
	/** Time the request was processed on the server. */
	processingTime: DateTime;
	/** Matches to the configuration reference time. */
	referenceTime: DateTime;
}

//#region Now

export interface BatchNow {
	tide: BatchNowTide;
	weather: BatchNowWeather;
	astro: BatchNowAstro;
}

export interface BatchNowTide {
	current: TidePointCurrentContextual;
	previousId: string;
	/** May be set if we are "close enough" to a tide extreme. */
	currentId: string | null;
	nextId: string;
}

export interface BatchNowWeather {
	/** Current weather. */
	current: BatchNowWeatherCurrent;
	/** Hourly weather for some time. */
	hourly: BatchNowWeatherHourly[];
	/** Id of the first hourly weather with a different indicator, if any. */
	indicatorChangeHourlyId: string | null;
}

export interface BatchNowWeatherCurrent extends WeatherPointCurrent {
	/** Whether it's daytime or not. */
	isDaytime: boolean;
}

export interface BatchNowWeatherHourly extends WeatherPointHourly {
	/** Whether it's daytime or not. */
	isDaytime: boolean;
}

export interface BatchNowAstro {
	sun: {
		/** May include mid-day. */
		previousId: string;
		/** May include mid-day. May be set if we are close enough to a sun event. */
		currentId: string | null;
		nextRiseSetTwilightId: string;
		nextRiseSetId: string;
		yesterday: AstroSunDay;
		today: AstroSunDay;
		tomorrow: AstroSunDay;
	};
	moon: {
		phase: AstroLunarPhase;
		// tidalSpan: AstroLunarTidalSpan | null;
		// nextTidalSpan: AstroLunarTidalSpan;
	};
}

//#endregion

//#region Week

export interface BatchWeek {
	/** Overall min and max of temperature for this range. */
	tempRange: Range<number>;
	/** Beach times by day for the next few days. */
	days: BeachTimeDay[];
}

export interface BeachTimeDay {
	/** The day, likely without time. */
	day: DateTime;
	/** Weather information for the day. */
	weather: WeatherPointDaily;
	/** Astro events for the day. */
	astro: AstroDay;
	/** Ranges, if any. */
	ranges: BeachTimeRange[];
	/** Extremes for the day. */
	tides: TidePointExtremeDay;
}


export interface BeachTimeRange {
	/** When the beach time begins. */
	start: DateTime;
	/** When the beach time ends. */
	stop: DateTime;
	/**
	 * The low tide(s) around which this beach time revolves, even if on a different day.
	 * We could feasibly have multiple if a high is below the cutoff height.
	*/
	tideLowIds: string[];
	/** Solar events that occur during this beach time, including that may be the cause of its start or end. */
	solarEventIds: string[];
	/** Indication of the weather in this range (preferring worse indicator for safety). */
	weather: WeatherIndicator;
}

//#endregion

export interface Range<T> {
	min: T;
	max: T;
}