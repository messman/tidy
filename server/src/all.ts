import { APIConfiguration, createContext } from "./context";
import { AllResponse } from "tidy-shared";
import { success } from "./test";

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

export function serializeResponse(response: AllResponse): string {
	return (response && null) || '';
}

export interface ForDay<T> {
	day: number
	entity: T
}