import { APIConfiguration, createContext, APIConfigurationContext } from "./context";
import { AllResponse, TideEventRange, AllDailyDay, Info } from "tidy-shared";
import { success } from "../test";
import { DateTime } from "luxon";

export function createConfigurationFor(time: Date, timeZoneLabel: string): APIConfiguration {
	return {
		configuration: {
			location: {
				timeZoneLabel: timeZoneLabel
			},
			time: {
				referenceTime: time,
				shortTermDataFetchDays: 3,
				longTermDataFetchDays: 7,
			},
			tides: {
				daysInPastToFetchTides: 1,
				tideHeightPrecision: 2
			},
			astro: {
				daysInPastToFetchSun: 1
			},
			weather: {
				hoursGapBetweenWeatherData: 3,
				temperaturePrecision: 1,
				defaultPrecision: 2
			}
		}
	}
}

export function createWellsConfiguration(): APIConfiguration {
	return createConfigurationFor(new Date(), "America/New_York");
}

export function getForConfiguration(configuration: APIConfiguration): AllResponse {
	const context = createContext(configuration);
	return success(context);
}

export interface ForDay<T> {
	day: number
	entity: T
}

export function createInfo(configContext: APIConfigurationContext): Info {
	return {
		referenceTime: configContext.configuration.time.referenceTime,
		processingTime: new Date(),
		tideHeightPrecision: configContext.configuration.tides.tideHeightPrecision
	}
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