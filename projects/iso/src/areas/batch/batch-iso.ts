import { DateTime } from 'luxon';
import { enumKeys } from '../../utility';
import * as Astro from '../astro';
import * as Tide from '../tide';
import * as Weather from '../weather';

export enum Seed {
	apple = 'apple',
	bronco = 'bronco',
	caesar = 'caesar',
	drum = 'drum',
	eggs = 'eggs',
	frost = 'frost',
	ginger = 'ginger',
	halo = 'halo',
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
	/** The current beach time range, if we're in one. */
	current: BeachTimeRange | null;
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
	/** Ranges, if any. */
	ranges: BeachTimeRange[];
}

export interface BeachTimeRange {
	/** When the beach time begins. */
	start: DateTime;
	/** When the beach time ends. */
	stop: DateTime;
	/** Blocks of weather described as ideal/not ideal. */
	weather: BeachTimeWeatherBlock[];
	/** Reasons for why the beach time starts when it does. */
	startReasons: BeachTimeReason[];
	/** Reasons for why the beach time stops when it does. */
	stopReasons: BeachTimeReason[];
}

export interface BeachTimeWeatherBlock {
	/** A somewhat-arbitrary indicator of if the weather is the best weather we can expect. */
	isBest: boolean;
	/** When this block starts. */
	start: DateTime,
	/** When this block stops. */
	stop: DateTime,
}

export interface BeachTimeTideMark {
	time: DateTime;
	/** In the context of the tides starting or stopping beach time, it should be either while rising or falling. */
	isRising: boolean;
}

/** A reason can be due to tides, sun, or weather. */
export type BeachTimeReason = BeachTimeTideMark | Weather.Hourly | Weather.Day | Astro.BodyEvent;

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
	measured: Tide.Stamp;
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