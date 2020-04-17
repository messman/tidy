import { APIConfiguration, createContext } from "./context";
import { AllResponse } from "tidy-shared";

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
				daysInPastToFetchTides: 1
			},
			weather: {
				hoursGapBetweenWeatherData: 3
			}
		}
	}
}

export function createWellsConfiguration(): APIConfiguration {
	return createConfigurationFor(new Date(), "America/New_York");
}

export async function getForConfiguration(configuration: APIConfiguration): AllResponse {
	const context = createContext(configuration);




}

export function serializeResponse(response: AllResponse): string {

}