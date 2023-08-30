import { WeatherStatusType } from '@wbtdevlocal/iso';

export interface WeatherStatusDescription {
	/** Fill in the blank: "It's _____ and 70 degrees." No capitalization. */
	itIsShort: string;
	/** Fill in the blank: "____ soon". Capitalization. */
	//soon: string;
	/** Capitalized description of the status. */
	conditions: string;
}
export const weatherStatusDescription: Record<keyof typeof WeatherStatusType, WeatherStatusDescription> = {
	unknown: {
		itIsShort: 'unknown',
		conditions: 'Weather conditions are unknown.'
	},
	clear: {
		itIsShort: 'clear',
		conditions: 'Fair and clear.'
	},
	clear_hot: {
		itIsShort: 'clear',
		conditions: `High-heat conditions; proceed with care.`
	},
	clear_cold: {
		itIsShort: 'clear',
		conditions: `Chilly conditions; proceed with care.`
	},
	clouds_few: {
		itIsShort: 'lightly cloudy',
		conditions: 'A few clouds in the sky.'
	},
	clouds_some: {
		itIsShort: 'lightly cloudy',
		conditions: 'Partly cloudy conditions.'
	},
	clouds_most: {
		itIsShort: 'mostly cloudy',
		conditions: 'Cloudy conditions.'
	},
	clouds_over: {
		itIsShort: 'overcast',
		conditions: 'Fully cloudy conditions.'
	},
	rain_drizzle: {
		itIsShort: 'drizzling',
		conditions: 'Drizzling and light rain conditions.'
	},
	rain_light: {
		itIsShort: 'lightly rainy',
		conditions: 'Light rain in the area.'
	},
	rain_medium: {
		itIsShort: 'rainy',
		conditions: 'Rainy conditions.'
	},
	rain_heavy: {
		itIsShort: 'rainy',
		conditions: 'Heavy rain conditions in the area.'
	},
	rain_freeze: {
		itIsShort: 'rainy',
		conditions: 'Freezing rain conditions.'
	},
	snow_light: {
		itIsShort: 'snowy',
		conditions: 'There is light snow in the area.'
	},
	snow_medium: {
		itIsShort: 'snowing',
		conditions: 'Snow conditions.'
	},
	snow_heavy: {
		itIsShort: 'snowing',
		conditions: 'Heavy snow conditions.'
	},
	snow_sleet: {
		itIsShort: 'sleeting',
		conditions: 'Sleet in the area.'
	},
	snow_rain: {
		itIsShort: 'snowy',
		conditions: 'Snow and rain conditions.'
	},
	thun_light: {
		itIsShort: 'potentially stormy',
		conditions: 'Light or scattered thunderstorms in the area.'
	},
	thun_medium: {
		itIsShort: 'stormy',
		conditions: 'Thunderstorm conditions.'
	},
	thun_heavy: {
		itIsShort: 'stormy',
		conditions: 'Heavy thunderstorms nearby.'
	},
	intense_storm: {
		itIsShort: 'stormy',
		conditions: 'Intense and dangerous storm conditions. Use caution.'
	},
	intense_other: {
		itIsShort: 'intense',
		conditions: 'Intense and dangerous weather conditions. Use caution!'
	},
	dust: {
		itIsShort: 'dusty',
		conditions: 'Dust in the air.'
	},
	smoke: {
		itIsShort: 'smoky',
		conditions: 'Smoke is in the air.'
	},
	haze: {
		itIsShort: 'hazy',
		conditions: 'Hazy conditions.'
	},
	fog: {
		itIsShort: 'foggy',
		conditions: 'Fog and mist conditions.'
	}
};