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

// const timespanRegex = /([0-9]+)([a-zA-Z])([0-9]*)([a-zA-Z]?)/;
// /** Parse a timeSpan from a single string that gives a time and a duration. */
// function timeSpanFromString(timeString: string, timeZone: string): TimeSpan {
// 	// 2019-07-19T10:00:00+00:00/PT1H means 7/10/2019, 10 AM GMT, for 1 hour
// 	const separatorIndex = timeString.indexOf("/");
// 	if (separatorIndex === -1)
// 		throw new Error('No separator for time span');

// 	const time = timeString.slice(0, separatorIndex);

// 	// Length could be "PT12H", "PT6H", "P1D", etc
// 	const lengthRaw = timeString.slice(separatorIndex + 3); // Leave off the "/PT"
// 	const matches = timespanRegex.exec(lengthRaw)!;
// 	console.log(lengthRaw, matches);
// 	const timespanTime1 = parseInt(matches[0], 10);
// 	const timespanLength1 = matches[1] === 'H' ? 1 : 24;

// 	const timespanTime2 = matches[2] ? parseInt(matches[2], 10) : null;
// 	const timespanLength2 = matches[3] ? (matches[3] === 'H' ? 1 : 24) : 0;
// 	const totalHours = (timespanTime1 * timespanLength1) + (timespanTime2 ? (timespanTime2 * timespanLength2) : 0);

// 	const luxonTime = DateTime.fromISO(time, { zone: timeZone });
// 	const luxonEnd = luxonTime.plus({ hours: totalHours });

// 	return {
// 		begin: luxonTime,
// 		end: luxonEnd
// 	}
// }

// function timeSpanFromTimes(startTimeString: string, endTimeString: string, timeZone: string): TimeSpan {
// 	// 2020-01-05T16:00:00-05:00
// 	// Parse using whatever offset is presented in the string, but convert to the given zone.
// 	const luxonStartTime = DateTime.fromISO(startTimeString, { zone: timeZone });
// 	const luxonEndTime = DateTime.fromISO(endTimeString, { zone: timeZone });
// 	return {
// 		begin: luxonStartTime,
// 		end: luxonEndTime
// 	}
// }

// function getStatusFromIcon(iconUrl: string): WeatherStatusType {
// 	// "https://api.weather.gov/icons/land/day/skc?size=small"
// 	// "https://api.weather.gov/icons/land/day/skc?size=small"
// 	const lastSlashIndex = iconUrl.lastIndexOf('/');
// 	if (lastSlashIndex === -1) {
// 		return WeatherStatusType.unknown;
// 	}
// 	// May be a comma or a question mark.
// 	const commaIndex = iconUrl.indexOf(',');
// 	const qMarkIndex = iconUrl.indexOf('?');

// 	let icon: string = null!;
// 	if (commaIndex !== -1) {
// 		icon = iconUrl.substring(lastSlashIndex + 1, commaIndex);
// 	}
// 	else if (qMarkIndex !== -1) {
// 		icon = iconUrl.substring(lastSlashIndex + 1, qMarkIndex);
// 	}
// 	else {
// 		icon = iconUrl.substring(lastSlashIndex + 1);
// 	}

// 	const weatherIconKey = icon as keyof typeof weatherIconStatuses;
// 	const weatherIconStatus = weatherIconStatuses[weatherIconKey];
// 	return weatherIconStatus || WeatherStatusType.unknown;
// }

// // Retrieved from https://api.weather.gov/icons
// const weatherIconStatuses = {
// 	"skc": WeatherStatusType.fair,
// 	"few": WeatherStatusType.cloud_few,
// 	"sct": WeatherStatusType.cloud_part,
// 	"bkn": WeatherStatusType.cloud_most,
// 	"ovc": WeatherStatusType.cloud_over,
// 	"wind_skc": WeatherStatusType.wind_fair,
// 	"wind_few": WeatherStatusType.wind_few,
// 	"wind_sct": WeatherStatusType.wind_part,
// 	"wind_bkn": WeatherStatusType.wind_most,
// 	"wind_ovc": WeatherStatusType.wind_over,
// 	"snow": WeatherStatusType.snow,
// 	"rain_snow": WeatherStatusType.rain_snow,
// 	"rain_sleet": WeatherStatusType.rain_sleet,
// 	"snow_sleet": WeatherStatusType.snow_sleet,
// 	"fzra": WeatherStatusType.rain_freeze,
// 	"rain_fzra": WeatherStatusType.rain_freeze_rain,
// 	"snow_fzra": WeatherStatusType.snow_freeze_rain,
// 	"sleet": WeatherStatusType.sleet,
// 	"rain": WeatherStatusType.rain,
// 	"rain_showers": WeatherStatusType.rain_showers_high,
// 	"rain_showers_hi": WeatherStatusType.rain_showers,
// 	"tsra": WeatherStatusType.thun_high,
// 	"tsra_sct": WeatherStatusType.thun_med,
// 	"tsra_hi": WeatherStatusType.thun_low,
// 	"tornado": WeatherStatusType.torn,
// 	"hurricane": WeatherStatusType.hurr,
// 	"tropical_storm": WeatherStatusType.trop,
// 	"dust": WeatherStatusType.dust,
// 	"smoke": WeatherStatusType.smoke,
// 	"haze": WeatherStatusType.haze,
// 	"hot": WeatherStatusType.hot,
// 	"cold": WeatherStatusType.cold,
// 	"blizzard": WeatherStatusType.blizz,
// 	"fog": WeatherStatusType.fog
// }