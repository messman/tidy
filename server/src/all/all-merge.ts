/* Holds common functionality for merging our different API areas. */

import { Errors, Warnings, TideEventRange, SunEvent, AllDailyDay, DailyWeather, Issue } from "tidy-shared";
import { InterpretedTides, interpretTides } from "../tide/tide-interpret";
import { InterpretedAstro, interpretAstro } from "../astro/astro-interpret";
import { InterpretedWeather, interpretWeather } from "../weather/weather-interpret";
import { APIConfigurationContext } from "./context";
import { ForDay } from "./all";
import { fetchTides } from "../tide/tide-fetch";
import { fetchAstro } from "../astro/astro-fetch";
import { fetchWeather } from "../weather/weather-fetch";
import { IntermediateTideValues } from "../tide/tide-intermediate";
import { IntermediateAstroValues } from "../astro/astro-intermediate";
import { IntermediateWeatherValues } from "../weather/weather-intermediate";

/** Base interface to hold common properties for error and warning. */
export interface AllIssue {
	errors: Errors | null,
	warnings: Warnings | null
}

/** Intermediate interface for Merge functions. */
export interface AllMerge extends AllIssue {
	interpretedTides: InterpretedTides,
	interpretedAstro: InterpretedAstro,
	interpretedWeather: InterpretedWeather
}

/** Common type for functions used for either real-life fetching or for testing. */
export interface AllMergeFunc {
	(configContext: APIConfigurationContext): Promise<AllMerge>
}

/** Real-life/production merge function. Should return only errors if any piece of any area is invalid. */
export const allMerge: AllMergeFunc = async (configContext: APIConfigurationContext) => {

	const requests: [Promise<IntermediateTideValues>, Promise<IntermediateAstroValues>, Promise<IntermediateWeatherValues>] = [
		fetchTides(configContext),
		fetchAstro(configContext),
		fetchWeather(configContext)
	];

	const [tidesData, astroData, weatherData] = await Promise.all(requests);

	const combinedDataErrors = mergeErrors(tidesData.errors, astroData.errors, weatherData.errors);
	if (combinedDataErrors) {
		return {
			errors: combinedDataErrors,
			warnings: null,
			interpretedTides: null!,
			interpretedAstro: null!,
			interpretedWeather: null!
		}
	}

	const interpretedTides = interpretTides(configContext, tidesData);
	const interpretedAstro = interpretAstro(configContext, astroData);
	const interpretedWeather = interpretWeather(configContext, weatherData);

	const combinedInterpretedErrors = mergeErrors(interpretedTides.errors, interpretedAstro.errors, interpretedWeather.errors);
	if (combinedInterpretedErrors) {
		return {
			errors: combinedInterpretedErrors,
			warnings: null,
			interpretedTides: null!,
			interpretedAstro: null!,
			interpretedWeather: null!
		}
	}

	return {
		errors: null,
		warnings: mergeWarnings(interpretedTides.warnings, interpretedAstro.warnings, interpretedWeather.warnings),
		interpretedTides: interpretedTides,
		interpretedAstro: interpretedAstro,
		interpretedWeather: interpretedWeather
	}
}

/** Merges different API areas for long-term data (daily weather, tides, etc). */
export function mergeForLongTerm(configContext: APIConfigurationContext, tides: ForDay<TideEventRange>[], sunEvents: ForDay<SunEvent[]>[], weatherEvents: DailyWeather[]): AllDailyDay[] {

	const referenceDay = configContext.context.referenceTimeInZone.startOf('day');
	const dayMap: Map<number, AllDailyDay> = new Map();

	tides.forEach((t) => {
		const day = referenceDay.plus({ days: t.day });
		dayMap.set(t.day, {
			date: day.toJSDate(),
			sun: null!,
			weather: null!,
			tides: t.entity
		});
	});
	sunEvents.forEach((s) => {
		const record = dayMap.get(s.day);
		if (record) {
			record.sun = s.entity;
		}
	});
	weatherEvents.forEach((w) => {
		const day = configContext.action.parseDateForZone(w.day).startOf('day').diff(referenceDay, 'days').days;
		const record = dayMap.get(day);
		if (record) {
			record.weather = w;
		}
	});

	return Array.from(dayMap.values())
}

/** Merges Errors objects. Returns null if there were no errors in any of the arguments. */
export function mergeErrors(...errors: (Errors | null)[]): Errors | null {
	const mergedIssues = mergeIssues(errors.map((e) => {
		return e?.errors || null;
	}));
	if (mergedIssues) {
		return {
			errors: mergedIssues
		}
	}
	return null;
}

/** Merges Warnings objects. Returns null if there were no warnings in any of the arguments. */
export function mergeWarnings(...warnings: (Warnings | null)[]): Warnings | null {
	const mergedIssues = mergeIssues(warnings.map((w) => {
		return w?.warnings || null;
	}));
	if (mergedIssues) {
		return {
			warnings: mergedIssues
		}
	}
	return null;
}

/** Merges issue arrays. Returns null if there were no issues in any of the argument arrays. */
export function mergeIssues(issues: (Issue[] | null)[]): Issue[] | null {
	const mergedIssues = issues.map<Issue[]>((i) => {
		return (i && i.length) ? i : [];
	}).flat();
	return mergedIssues.length > 0 ? mergedIssues : null;
}