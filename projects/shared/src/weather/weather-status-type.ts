export enum WeatherStatusType {
	unknown,
	fair,
	cloud_few,
	cloud_part,
	cloud_most,
	cloud_over,
	wind_fair,
	wind_few,
	wind_part,
	wind_most,
	wind_over,
	snow,
	rain_snow,
	rain_sleet,
	snow_sleet,
	rain_freeze,
	rain_freeze_rain,
	snow_freeze_rain,
	sleet,
	rain,
	rain_showers_high,
	rain_showers,
	thun_high,
	thun_med,
	thun_low,
	torn,
	hurr,
	trop,
	dust,
	smoke,
	haze,
	hot,
	cold,
	blizz,
	fog
}
export interface WeatherStatusDescription {
	short: string,
	long: string;
}
export type WeatherStatusDescriptionMap = Record<keyof typeof WeatherStatusType, WeatherStatusDescription>;
export const weatherStatusTypeDescription: WeatherStatusDescriptionMap = {
	unknown: {
		short: 'Unknown',
		long: 'Unknown'
	},
	fair: {
		short: 'Fair',
		long: 'Fair and clear'
	},
	cloud_few: {
		short: 'Some clouds',
		long: 'A few clouds'
	},
	cloud_part: {
		short: 'Some clouds',
		long: 'Partly cloudy'
	},
	cloud_most: {
		short: 'Cloudy',
		long: 'Mostly cloudy'
	},
	cloud_over: {
		short: 'Overcast',
		long: 'Overcast'
	},
	wind_fair: {
		short: 'Windy',
		long: 'Fair / clear and windy'
	},
	wind_few: {
		short: 'Windy',
		long: 'A few clouds and windy'
	},
	wind_part: {
		short: 'Windy',
		long: 'Partly cloudy and windy'
	},
	wind_most: {
		short: 'Cloudy/windy',
		long: 'Mostly cloudy and windy'
	},
	wind_over: {
		short: 'Cloudy/windy',
		long: 'Overcast and windy'
	},
	snow: {
		short: 'Snow',
		long: 'Snow'
	},
	rain_snow: {
		short: 'Rain/snow',
		long: 'Rain and snow'
	},
	rain_sleet: {
		short: 'Rain/sleet',
		long: 'Rain and sleet'
	},
	snow_sleet: {
		short: 'Rain/sleet',
		long: 'Rain and sleet'
	},
	rain_freeze: {
		short: 'Freezing rain',
		long: 'Freezing rain'
	},
	rain_freeze_rain: {
		short: 'Freezing rain',
		long: 'Rain and freezing rain'
	},
	snow_freeze_rain: {
		short: 'Freezing rain',
		long: 'Freezing rain and snow'
	},
	sleet: {
		short: 'Sleet',
		long: 'Sleet'
	},
	rain: {
		short: 'Rain',
		long: 'Rain'
	},
	rain_showers_high: {
		short: 'Rain',
		long: 'Rain showers with high cloud cover'
	},
	rain_showers: {
		short: 'Rain',
		long: 'Rain showers with low cloud cover'
	},
	thun_high: {
		short: 'Thunderstorms',
		long: 'Thunderstorm with high cloud cover'
	},
	thun_med: {
		short: 'Thunderstorms',
		long: 'Thunderstorms with medium cloud cover'
	},
	thun_low: {
		short: 'Thunderstorms',
		long: 'Thunderstorms with low cloud cover'
	},
	torn: {
		short: 'Tornado',
		long: 'Tornado conditions'
	},
	hurr: {
		short: 'Hurricane',
		long: 'Hurricane conditions'
	},
	trop: {
		short: 'Storm',
		long: 'Tropical storm conditions'
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
	hot: {
		short: 'Hot',
		long: 'Hot'
	},
	cold: {
		short: 'Cold',
		long: 'Cold'
	},
	blizz: {
		short: 'Blizzard',
		long: 'Blizzard'
	},
	fog: {
		short: 'Fog/mist',
		long: 'Fog and mist'
	},
};