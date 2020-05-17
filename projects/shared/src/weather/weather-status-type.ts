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

export type WeatherStatusDescriptionMap = Record<keyof typeof WeatherStatusType, string>;
export const weatherStatusTypeDescription: WeatherStatusDescriptionMap = {
	unknown: "unknown",
	fair: "Fair/clear",
	cloud_few: "A few clouds",
	cloud_part: "Partly cloudy",
	cloud_most: "Mostly cloudy",
	cloud_over: "Overcast",
	wind_fair: "Fair/clear and windy",
	wind_few: "A few clouds and windy",
	wind_part: "Partly cloudy and windy",
	wind_most: "Mostly cloudy and windy",
	wind_over: "Overcast and windy",
	snow: "Snow",
	rain_snow: "Rain/snow",
	rain_sleet: "Rain/sleet",
	snow_sleet: "Rain/sleet",
	rain_freeze: "Freezing rain",
	rain_freeze_rain: "Rain/freezing rain",
	snow_freeze_rain: "Freezing rain/snow",
	sleet: "Sleet",
	rain: "Rain",
	rain_showers_high: "Rain showers (high cloud cover)",
	rain_showers: "Rain showers (low cloud cover)",
	thun_high: "Thunderstorm (high cloud cover)",
	thun_med: "Thunderstorm (medium cloud cover)",
	thun_low: "Thunderstorm (low cloud cover)",
	torn: "Tornado",
	hurr: "Hurricane conditions",
	trop: "Tropical storm conditions",
	dust: "Dust",
	smoke: "Smoke",
	haze: "Haze",
	hot: "Hot",
	cold: "Cold",
	blizz: "Blizzard",
	fog: "Fog/mist"
}