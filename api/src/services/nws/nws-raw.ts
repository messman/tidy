import { getJSON, SingleAPIResponse, SingleUntypedAPIResponse, errorIssue } from "../shared/fetch";

// 43.293,-70.569
// https://api.weather.gov/points/43.293%2C-70.569

const area = 'nws';

/**
 * The NWS has multiple URLs to call for different structures of data.
 * Root: basically organized by property, and has everything but descriptions.
 * Period/Hourly: organized by time, and is almost everything but includes descriptions.
 * 
 * Gridpoint in URL is not coordinates - it's for Wells, Maine.
 */

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

export interface GetRootDataAction {
	(): Promise<SingleUntypedAPIResponse>;
}

/** Split apart here just for testing purposes. */
export const getRootData: GetRootDataAction = async () => {
	// This is for Wells, Maine - url is not coordinates
	return await getJSON('https://api.weather.gov/gridpoints/GYX/68,39/', area);
}

export async function processRootData(getRootData: GetRootDataAction): Promise<SingleAPIResponse<RootData>> {

	const untypedResponse = await getRootData();

	const typedResponse = untypedResponse as SingleAPIResponse<RootData>;
	const result = untypedResponse.result;
	if (result) {
		if (result["error"]) {
			// TODO: Handle error, don't set a result
			typedResponse.issues.push(errorIssue('The nws data request returned an error', 'Error in json root data'));
		}
		else {
			// Do some light processing to trim away the data we don't need.
			try {

				/**
				 * Return data has a top-level "properties" with all the types of data under it.
				 * Looks like:
				 * 	"properties": {
				 * 		"temperature": {
				 * 			"sourceUnit": "F",
				 * 			"uom": "unit:degC",
				 * 			"values": [
				 * 				{
				 * 					"validTime": "2019-12-22T13:00:00+00:00/PT1H",
				 * 					"value": -5
				 * 				}
				 * 			]
				 * 		}
				 * 	}
				 * 
				 * Properties include:
				 * - temperature
				 * - skyCover
				 * - windDirection
				 * - windSpeed
				 * - probabilityOfPrecipitation
				 * 
				 * - dewpoint
				 * - maxTemperature
				 * - minTemperature
				 * - relativeHumidity
				 * - apparentTemperature
				 * - heatIndex
				 * - windChill
				 * etc
				 */

				const properties = result["properties"];

				typedResponse.result = {
					temperature: properties["temperature"]["values"],
					skyCover: properties["skyCover"]["values"],
					windDirection: properties["windDirection"]["values"],
					windSpeed: properties["windSpeed"]["values"],
					probabilityOfPrecipitation: properties["probabilityOfPrecipitation"]["values"],
				}
			}
			catch (e) {
				// Bail
				typedResponse.issues.push(errorIssue('There was an error processing the nws data', 'Error in root result processing', e));
			}
		}
	}

	return typedResponse;
}

export interface RootData {
	temperature: RootTimeValue[],
	skyCover: RootTimeValue[],
	windDirection: RootTimeValue[],
	windSpeed: RootTimeValue[],
	probabilityOfPrecipitation: RootTimeValue[],
}

export interface RootTimeValue {
	validTime: string,
	value: number | null
}

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

export interface GetHourlyDataAction {
	(): Promise<SingleUntypedAPIResponse>;
}

/** Split apart here just for testing purposes. */
export const getHourlyData: GetHourlyDataAction = async () => {
	// This is for Wells, Maine - url is not coordinates
	return await getJSON('https://api.weather.gov/gridpoints/GYX/68,39/forecast/hourly', area);
}

export async function processHourlyData(getHourlyData: GetHourlyDataAction): Promise<SingleAPIResponse<HourlyData[]>> {

	const untypedResponse = await getHourlyData();

	const typedResponse = untypedResponse as SingleAPIResponse<HourlyData[]>;
	const result = untypedResponse.result;
	if (result) {
		if (result["error"]) {
			// TODO: Handle error, don't set a result
			typedResponse.issues.push(errorIssue('The nws data request returned an error', 'Error in json hourly data'));
		}
		else {
			// Do some light processing to trim away the data we don't need.
			try {

				/**
				 * Return data has a top-level "properties" with all the types of data under it.
				 *	"properties": {
				 *		"periods": [
				 *			{
				 *				"number": 80,
				 *				"name": "",
				 *				"startTime": "2020-01-08T23:00:00-05:00",
				 *				"endTime": "2020-01-09T00:00:00-05:00",
				 *				"isDaytime": false,
				 *				"temperature": 23,
				 *				"temperatureUnit": "F",
				 *				"temperatureTrend": null,
				 *				"windSpeed": "20 mph",
				 *				"windDirection": "NW",
				 *				"icon": "https://api.weather.gov/icons/land/night/few?size=small",
				 *				"shortForecast": "Mostly Clear",
				 *				"detailedForecast": ""
				 *			},
				 */

				const periods = result["properties"]["periods"] as {}[];

				typedResponse.result = periods.map<HourlyData>(function (periodObject) {
					return {
						startTime: periodObject['startTime'],
						endTime: periodObject['endTime'],
						icon: periodObject['icon'],
						shortForecast: periodObject['shortForecast'],
					}
				});
			}
			catch (e) {
				// Bail
				typedResponse.issues.push(errorIssue('There was an error processing the nws data', 'Error in hourly result processing', e));
			}
		}
	}

	return typedResponse;
}

export interface HourlyData {
	startTime: string,
	endTime: string,
	icon: string,
	shortForecast: string,
}

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

// The below code is commented out because I'm not sure if it's even needed. What benefit do we get from it?
// Answer: The description is pretty important... but is it worth trying to organize all the data between root and this?

// export async function getPeriodData(): Promise<SingleAPIResponse<PeriodData[]>> {
// 	const response = await getJSON('https://api.weather.gov/gridpoints/GYX/68,39/forecast/', area);
// 	const typedResponse = response as SingleAPIResponse<PeriodData[]>;

// 	const result = response.result;
// 	if (result) {
// 		if (result["error"]) {
// 			// TODO: Handle error, don't set a result
// 			typedResponse.issues.push(errorIssue('There nws data request returned an error', 'Error in period json data'));
// 		}
// 		else {
// 			// Do some light processing to trim away the data we don't need.
// 			try {

// 				/**
// 				 * Return data has a top-level "properties" with all the types of data under it.
// 				 *	"properties": {
// 				 *		"periods": [
// 				 * 			{
// 				 * 				"number": 1,
// 				 * 				"name": "This Afternoon",
// 				 * 				"startTime": "2019-12-22T15:00:00-05:00",
// 				 * 				"endTime": "2019-12-22T18:00:00-05:00",
// 				 * 				"isDaytime": true,
// 				 * 				"temperature": 41,
// 				 * 				"temperatureUnit": "F",
// 				 * 				"temperatureTrend": null,
// 				 * 				"windSpeed": "10 mph",
// 				 * 				"windDirection": "SW",
// 				 * 				"icon": "https://api.weather.gov/icons/land/day/sct?size=medium",
// 				 * 				"shortForecast": "Mostly Sunny",
// 				 * 				"detailedForecast": "Mostly sunny, with a high near 41. Southwest wind around 10 mph."
// 				 * 			}
// 				 */

// 				const periods = result["properties"]["periods"] as {}[];

// 				typedResponse.result = periods.map<PeriodData>(function (periodObject) {
// 					return {
// 						name: periodObject['name'],
// 						startTime: periodObject['startTime'],
// 						endTime: periodObject['endTime'],
// 						isDaytime: periodObject['isDaytime'],
// 						temperature: periodObject['temperature'],
// 						temperatureUnit: periodObject['temperatureUnit'],
// 						shortForecast: periodObject['shortForecast'],
// 						detailedForecast: periodObject['detailedForecast'],
// 					}
// 				});
// 			}
// 			catch (e) {
// 				// Bail
// 				typedResponse.issues.push(errorIssue('There was an error processing the nws data', 'Error in period result processing', e));
// 			}
// 		}
// 	}

// 	return typedResponse;
// }

// interface PeriodData {
// 	name: string, // Tonight, Friday, etc
// 	startTime: string,
// 	endTime: string,
// 	isDaytime: boolean,
// 	temperature: number,
// 	temperatureUnit: string,
// 	shortForecast: string,
// 	detailedForecast: string
// }

