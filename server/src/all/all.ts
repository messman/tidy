import { APIConfiguration, createContext } from "./context";
import { AllResponse, Info } from "tidy-shared";
import { allTestMerge } from "../test";
import { AllMergeFunc, allMerge, mergeForLongTerm } from "./all-merge";

export function createConfigurationFor(time: Date, timeZoneLabel: string, station: number): APIConfiguration {
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
				station: station,
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
	return createConfigurationFor(new Date(), "America/New_York", 8419317);
}

export async function getAllForConfiguration(configuration: APIConfiguration): Promise<AllResponse> {
	return getAll(configuration, allMerge);
}

export async function getAllTestForConfiguration(configuration: APIConfiguration): Promise<AllResponse> {
	return getAll(configuration, allTestMerge);
}

async function getAll(configuration: APIConfiguration, mergeFunc: AllMergeFunc): Promise<AllResponse> {

	const configContext = createContext(configuration);
	const { errors, warnings, interpretedTides, interpretedAstro, interpretedWeather } = await mergeFunc(configContext);

	const info: Info = {
		referenceTime: configContext.configuration.time.referenceTime,
		processingTime: new Date(),
		tideHeightPrecision: configContext.configuration.tides.tideHeightPrecision
	}

	if (errors) {
		return {
			info: info,
			error: errors,
			data: null
		};
	}

	return {
		info: info,
		error: null,
		data: {
			warning: warnings,
			current: {
				sun: {
					previous: interpretedAstro.previousEvent,
					next: interpretedAstro.nextEvent
				},
				weather: interpretedWeather.currentWeather,
				tides: interpretedTides.currentTides
			},
			predictions: {
				cutoffDate: configContext.context.maxShortTermDataFetch.toJSDate(),
				sun: interpretedAstro.shortTermEvents,
				weather: interpretedWeather.shortTermWeather,
				tides: interpretedTides.shortTermTides
			},
			daily: {
				cutoffDate: configContext.context.maxLongTermDataFetch.toJSDate(),
				tideExtremes: interpretedTides.longTermTideExtremes,
				days: mergeForLongTerm(configContext, interpretedTides.longTermTides, interpretedAstro.longTermEvents, interpretedWeather.longTermWeather)
			}
		}
	}

}


export interface ForDay<T> {
	day: number
	entity: T
}