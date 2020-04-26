import { Errors, Warnings, TideEventRange, SunEvent, AllDailyDay, DailyWeather, Issue } from "tidy-shared";
import { InterpretedTides } from "../tide/tide-interpret";
import { InterpretedAstro } from "../astro/astro-interpret";
import { InterpretedWeather } from "../weather/weather-interpret";
import { APIConfigurationContext } from "./context";
import { ForDay } from "./all";

export interface AllIssue {
	errors: Errors | null,
	warnings: Warnings | null
}

export interface AllMerge extends AllIssue {
	interpretedTides: InterpretedTides,
	interpretedAstro: InterpretedAstro,
	interpretedWeather: InterpretedWeather
}

export interface AllMergeFunc {
	(configContext: APIConfigurationContext): Promise<AllMerge>
}

export const allMerge: AllMergeFunc = (configContext: APIConfigurationContext) => {
	return configContext && null!;
}

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

export function mergeIssues(issues: (Issue[] | null)[]): Issue[] | null {
	const mergedIssues = issues.map<Issue[]>((i) => {
		return (i && i.length) ? i : [];
	}).flat();
	return mergedIssues.length > 0 ? mergedIssues : null;
}