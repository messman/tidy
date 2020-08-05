import { AllResponse, Info } from 'tidy-shared';
import { allTestMerge } from '../test/all';
import { serverLog } from '../util/log';
import { defaultRunFlags, RunFlags } from '../util/run-flags';
import { allMerge, AllMergeFunc, mergeForLongTerm } from './all-merge';
import { APIConfiguration, createContext } from './context';

/** Creates a default configuration, requiring the location / time information for the area of interest. */
export function createConfigurationFor(time: Date, timeZoneLabel: string, station: number, latitude: number, longitude: number): APIConfiguration {
	return {
		configuration: {
			location: {
				latitude: latitude,
				longitude: longitude,
				timeZoneLabel: timeZoneLabel
			},
			time: {
				referenceTime: time,
				shortTermDataFetchHours: 30,
				longTermDataFetchDays: 5,
			},
			tides: {
				station: station,
				daysInPastToFetchTides: 1,
				tideHeightPrecision: 1
			},
			astro: {
				daysInPastToFetchSun: 1,
			},
			weather: {
				hoursGapBetweenWeatherData: 1,
				includeChanges: false,
				temperaturePrecision: 1,
				defaultPrecision: 1
			}
		}
	};
}

/** Creates a configuration for Wells, Maine, which is the target location for this application. */
export function createWellsConfiguration(): APIConfiguration {
	return createConfigurationFor(new Date(), "America/New_York", 8419317, 43.294043, -70.568704);
}

/** The main function - retrieves the 'AllResponse' object for the provided configuration. Calls APIs. */
export async function getAllForConfiguration(configuration: APIConfiguration, runFlags: RunFlags | null): Promise<AllResponse> {
	return getAll(configuration, allMerge, runFlags);
}

/** The main test function - creates random data and interprets it using the same common functions from the production function. */
export async function getAllTestForConfiguration(configuration: APIConfiguration, runFlags: RunFlags | null): Promise<AllResponse> {
	return getAll(configuration, allTestMerge, runFlags);
}

/** Common function that takes a 'Merge Function' to resolve issues and warnings and retrieve the data. */
async function getAll(configuration: APIConfiguration, mergeFunc: AllMergeFunc, runFlags: RunFlags | null): Promise<AllResponse> {
	serverLog(runFlags, 'Started');
	runFlags = runFlags || defaultRunFlags;

	const configContext = createContext(configuration);
	serverLog(runFlags, 'Created context');

	const { errors, warnings, interpretedTides, interpretedAstro, interpretedWeather } = await mergeFunc(configContext, runFlags);

	const info: Info = {
		referenceTime: configContext.context.referenceTimeInZone,
		processingTime: configContext.action.parseDateForZone(new Date()),
		tideHeightPrecision: configContext.configuration.tides.tideHeightPrecision,
		timeZone: configContext.configuration.location.timeZoneLabel
	};

	if (errors) {
		return {
			info: info,
			error: errors,
			all: null
		};
	}

	const response: AllResponse = {
		info: info,
		error: null,
		all: {
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
				cutoffDate: configContext.context.maxShortTermDataFetch,
				sun: interpretedAstro.shortTermEvents,
				weather: interpretedWeather.shortTermWeather,
				tides: interpretedTides.shortTermTides
			},
			daily: {
				cutoffDate: configContext.context.maxLongTermDataFetch,
				tideExtremes: interpretedTides.longTermTideExtremes,
				days: mergeForLongTerm(configContext, interpretedTides.longTermTides, interpretedAstro.longTermEvents, interpretedWeather.longTermWeather)
			}
		}
	};
	serverLog(runFlags, 'Finished');
	return response;
}

/** Intermediate interface used when merging API data. Holds data for a specific day. */
export interface ForDay<T> {
	day: number;
	entity: T;
}