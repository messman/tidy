// // https://api.weather.gov/gridpoints/GYX/68,39/forecast
// // https://api.weather.gov/gridpoints/GYX/68,39/forecast/hourly

// // From https://api.weather.gov/gridpoints/GYX/68,39
// export interface RawWeatherValue<T> {
// 	/** Time, of form 2020-04-21T07:00:00+00:00/PT1H */
// 	validTime: string,
// 	value: T
// }

// export interface RawWeatherForecast {
// 	number: number,
// 	name: string,
// 	startTime: string,
// 	endTime: string,
// 	isDaytime: boolean,
// 	temperature: number,
// 	temperatureUnit: string,
// 	windSpeed: s
// }





// // Retrieved from https://api.weather.gov/icons
// const status = {
// 	"skc": "Fair/clear",
// 	"few": "A few clouds",
// 	"sct": "Partly cloudy",
// 	"bkn": "Mostly cloudy",
// 	"ovc": "Overcast",
// 	"wind_skc": "Fair/clear and windy",
// 	"wind_few": "A few clouds and windy",
// 	"wind_sct": "Partly cloudy and windy",
// 	"wind_bkn": "Mostly cloudy and windy",
// 	"wind_ovc": "Overcast and windy",
// 	"snow": "Snow",
// 	"rain_snow": "Rain/snow",
// 	"rain_sleet": "Rain/sleet",
// 	"snow_sleet": "Rain/sleet",
// 	"fzra": "Freezing rain",
// 	"rain_fzra": "Rain/freezing rain",
// 	"snow_fzra": "Freezing rain/snow",
// 	"sleet": "Sleet",
// 	"rain": "Rain",
// 	"rain_showers": "Rain showers (high cloud cover)",
// 	"rain_showers_hi": "Rain showers (low cloud cover)",
// 	"tsra": "Thunderstorm (high cloud cover)",
// 	"tsra_sct": "Thunderstorm (medium cloud cover)",
// 	"tsra_hi": "Thunderstorm (low cloud cover)",
// 	"tornado": "Tornado",
// 	"hurricane": "Hurricane conditions",
// 	"tropical_storm": "Tropical storm conditions",
// 	"dust": "Dust",
// 	"smoke": "Smoke",
// 	"haze": "Haze",
// 	"hot": "Hot",
// 	"cold": "Cold",
// 	"blizzard": "Blizzard",
// 	"fog": "Fog/mist"
// }