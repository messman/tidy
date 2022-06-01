import { AstroConfig, AstroInput, createAstroLive } from '../../services/astro/astro-config';
import { BaseConfig, BaseInput, createBaseLive } from '../../services/config';
import { createTideLive, TideConfig, TideInput } from '../../services/tide/tide-config';
import { WeatherConfig, WeatherInput } from '../../services/weather/weather-config';

/** Creates a configuration for Wells, Maine, which is the target location for this application. */
export function createWellsConfig(): BatchConfig {
	return createConfigFor(new Date(), "America/New_York", 8419317, 43.294043, -70.568704);
}

/** Creates a default configuration, requiring the location / time information for the area of interest. */
function createConfigFor(time: Date, timeZoneLabel: string, station: number, latitude: number, longitude: number): BatchConfig {

	const baseInput: BaseInput = {
		latitude: latitude,
		longitude: longitude,
		timeZoneLabel: timeZoneLabel,
		referenceTime: time,
		shortTermDataFetchHours: 30,
		longTermDataFetchDays: 5,
	};
	const baseConfig: BaseConfig = {
		input: baseInput,
		live: createBaseLive(baseInput)
	};

	const tideInput: TideInput = {
		station: station,
		daysInPastToFetchTides: 1,
		tideHeightPrecision: 1
	};

	const astroInput: AstroInput = {
		daysInPastToFetchSun: 1,
	};

	const weatherInput: WeatherInput = {
		hoursGapBetweenWeatherData: 1,
		includeChanges: false,
		temperaturePrecision: 1,
		defaultPrecision: 1
	};

	return {
		base: baseConfig,
		tide: {
			input: tideInput,
			live: createTideLive(baseConfig, tideInput)
		},
		astro: {
			input: astroInput,
			live: createAstroLive(baseConfig, astroInput)
		},
		weather: {
			input: weatherInput,
		}
	};
}

export interface BatchConfig extends TideConfig, AstroConfig, WeatherConfig { }