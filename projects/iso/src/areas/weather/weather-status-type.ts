export enum StatusType {
	unknown,
	clear,
	clear_hot,
	clear_cold,
	clouds_few,
	clouds_some,
	clouds_most,
	clouds_over,
	rain_drizzle,
	rain_light,
	rain_medium,
	rain_heavy,
	rain_freeze,
	snow_light,
	snow_medium,
	snow_heavy,
	snow_sleet,
	snow_rain,
	thun_light,
	thun_medium,
	thun_heavy,
	intense_storm,
	intense_other,
	dust,
	smoke,
	haze,
	fog
}
export interface StatusDescription {
	short: string;
	long: string;
}
export type StatusDescriptionMap = Record<keyof typeof StatusType, StatusDescription>;
export const statusTypeDescription: StatusDescriptionMap = {
	unknown: {
		short: 'Unknown',
		long: 'Unknown'
	},
	clear: {
		short: 'Clear',
		long: 'Fair and clear'
	},
	clear_hot: {
		short: 'Hot',
		long: 'Hot'
	},
	clear_cold: {
		short: 'Cold',
		long: 'Cold'
	},
	clouds_few: {
		short: 'Few Clouds',
		long: 'A few clouds'
	},
	clouds_some: {
		short: 'Clouds',
		long: 'Partly cloudy'
	},
	clouds_most: {
		short: 'Clouds',
		long: 'Mostly cloudy'
	},
	clouds_over: {
		short: 'Overcast',
		long: 'Overcast'
	},
	rain_drizzle: {
		short: 'Drizzle',
		long: 'Drizzling'
	},
	rain_light: {
		short: 'Rain',
		long: 'Light rain'
	},
	rain_medium: {
		short: 'Rain',
		long: 'Rain'
	},
	rain_heavy: {
		short: 'Rain',
		long: 'Heavy rain'
	},
	rain_freeze: {
		short: 'Rain',
		long: 'Freezing rain'
	},
	snow_light: {
		short: 'Snow',
		long: 'Light snow'
	},
	snow_medium: {
		short: 'Snow',
		long: 'Snow'
	},
	snow_heavy: {
		short: 'Snow',
		long: 'Heavy snow'
	},
	snow_sleet: {
		short: 'Sleet',
		long: 'Sleeting'
	},
	snow_rain: {
		short: 'Snow',
		long: 'Snow and rain'
	},
	thun_light: {
		short: 'Thunderstorm',
		long: 'Light or scattered thunderstorms'
	},
	thun_medium: {
		short: 'Thunderstorm',
		long: 'Thunderstorms'
	},
	thun_heavy: {
		short: 'Thunderstorm',
		long: 'Heavy thunderstorms'
	},
	intense_storm: {
		short: 'Intense',
		long: 'Intense and dangerous storms'
	},
	intense_other: {
		short: 'Intense',
		long: 'Intense and dangerous weather'
	},
	dust: {
		short: 'Dust',
		long: 'Dust'
	},
	smoke: {
		short: 'Smoke',
		long: 'Smoke'
	},
	haze: {
		short: 'Haze',
		long: 'Haze'
	},
	fog: {
		short: 'Fog/mist',
		long: 'Fog and mist'
	}
};