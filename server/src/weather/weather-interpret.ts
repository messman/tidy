import { WeatherStatus, DailyWeather } from 'tidy-shared';
import { APIConfigurationContext } from '../context';
import { ForDay } from '../all';
import { IntermediateWeatherValues } from './weather-intermediate';
import { TimeSpan, createChangeIterator, createStringIterator } from '../util/iterator';
import { DateTime } from 'luxon';
import { WeatherStatusType } from 'tidy-shared/dist/weather/weather-status-type';

export interface InterpretedWeather {
	currentWeather: WeatherStatus,
	shortTermWeather: WeatherStatus[],
	longTermWeather: ForDay<DailyWeather>[]
}

export function interpretWeather(configurationContext: APIConfigurationContext, weatherValues: IntermediateWeatherValues): InterpretedWeather {

	const referenceTime = configurationContext.context.referenceTimeInZone;
	const shortTermLimit = configurationContext.context.maxShortTermDataFetch;
	const longTermLimit = configurationContext.context.maxLongTermDataFetch;
	const hoursGapBetweenWeatherData = configurationContext.configuration.weather.hoursGapBetweenWeatherData;

	// Create iterators for each of the root values, stored independently
	const temperatureIterator = createChangeIterator(weatherValues.temperature);
	const feelsLikeIterator = createChangeIterator(weatherValues.apparentTemperature);
	const chanceRainIterator = createChangeIterator(weatherValues.probabilityOfPrecipitation);
	const windDirectionIterator = createStringIterator(weatherValues.windDirection);
	const windIterator = createChangeIterator(weatherValues.windSpeed);
	const dewPointIterator = createChangeIterator(weatherValues.dewPoint);
	const cloudCoverIterator = createChangeIterator(weatherValues.cloudCover);
	const visibilityIterator = createChangeIterator(weatherValues.visibility);
	const statusIterator = createStringIterator(weatherValues.icon);

	let currentWeather: WeatherStatus = null!;
	const shortTermWeather: WeatherStatus[] = [];
	const longTermWeather: ForDay<DailyWeather>[] = []

	// Get the start of the current hour and go from there.
	const startHour = referenceTime.plus({ hours: 1 }).startOf("hour");
	// Get the hours between our start hour and our short-term limit
	const hoursBetween = shortTermLimit.diff(startHour, "hours").hours;
	const nIterations = Math.ceil(hoursBetween / hoursGapBetweenWeatherData);

	for (let i = 0; i < nIterations; i++) {
		const dateTime = startHour.plus({ hours: i * hoursGapBetweenWeatherData });

		const hourlyNext = hourlyDataIterator.next(dateTime);
		let status: string = null;
		let desc: string = null;
		if (hourlyNext) {
			status = getStatusFromIcon(hourlyNext.data.value.icon);
			desc = hourlyNext.data.value.shortForecast;
		}

		const short: WeatherStatus = {
			time: dateTime,
			temp: tempIterator.next(dateTime),
			skyCover: skyIterator.next(dateTime),
			windDirection: windDirIterator.next(dateTime), // TODO - I think this is actually a number, not a string
			windSpeed: windSpeedIterator.next(dateTime),
			rainChance: rainIterator.next(dateTime),
			status: status,
			desc: desc
		}

		nwsResponse.short.push(short);
	}


	return {
		currentWeather: currentWeather,
		shortTermWeather: shortTermWeather,
		longTermWeather: longTermWeather
	};
}


/*
	What we should track:
	- temperature
	- apparentTemperature
	windDirection
	windSpeed
	probabilityOfPrecipitation

	- relativeHumidity
	- dewpoint
	- minTemperature
	- maxTemperature
	skyCover
	windChill
	visibility

	weather (description)

	Other:
	temperature
	dewpoint
	maxtemperature
	mintemperature
	relativeHumidity
	apparentTemperature (feels like)
	heatIndex
	windChill
	skyCover
	windDirection
	windSpeed
	windGust
	weather
	probabilityOfPrecipitation
	quantitativePrecipitation
	iceAccumulation
	snowfallAmount
	ceilingHiehgt
	visibility
	transportWindSpeed
	transpoirtWindDirection
	MixingHeight
	...
*/

const timespanRegex = /([0-9]+)([a-zA-Z])([0-9]*)([a-zA-Z]?)/;
/** Parse a timeSpan from a single string that gives a time and a duration. */
function timeSpanFromString(timeString: string, timeZone: string): TimeSpan {
	// 2019-07-19T10:00:00+00:00/PT1H means 7/10/2019, 10 AM GMT, for 1 hour
	const separatorIndex = timeString.indexOf("/");
	if (separatorIndex === -1)
		throw new Error('No separator for time span');

	const time = timeString.slice(0, separatorIndex);

	// Length could be "PT12H", "PT6H", "P1D", etc
	const lengthRaw = timeString.slice(separatorIndex + 3); // Leave off the "/PT"
	const matches = timespanRegex.exec(lengthRaw)!;
	console.log(lengthRaw, matches);
	const timespanTime1 = parseInt(matches[0], 10);
	const timespanLength1 = matches[1] === 'H' ? 1 : 24;

	const timespanTime2 = matches[2] ? parseInt(matches[2], 10) : null;
	const timespanLength2 = matches[3] ? (matches[3] === 'H' ? 1 : 24) : 0;
	const totalHours = (timespanTime1 * timespanLength1) + (timespanTime2 ? (timespanTime2 * timespanLength2) : 0);

	const luxonTime = DateTime.fromISO(time, { zone: timeZone });
	const luxonEnd = luxonTime.plus({ hours: totalHours });

	return {
		begin: luxonTime,
		end: luxonEnd
	}
}

function timeSpanFromTimes(startTimeString: string, endTimeString: string, timeZone: string): TimeSpan {
	// 2020-01-05T16:00:00-05:00
	// Parse using whatever offset is presented in the string, but convert to the given zone.
	const luxonStartTime = DateTime.fromISO(startTimeString, { zone: timeZone });
	const luxonEndTime = DateTime.fromISO(endTimeString, { zone: timeZone });
	return {
		begin: luxonStartTime,
		end: luxonEndTime
	}
}

function getStatusFromIcon(iconUrl: string): WeatherStatusType {
	// "https://api.weather.gov/icons/land/day/skc?size=small"
	// "https://api.weather.gov/icons/land/day/skc?size=small"
	const lastSlashIndex = iconUrl.lastIndexOf('/');
	if (lastSlashIndex === -1) {
		return WeatherStatusType.unknown;
	}
	// May be a comma or a question mark.
	const commaIndex = iconUrl.indexOf(',');
	const qMarkIndex = iconUrl.indexOf('?');

	let icon: string = null!;
	if (commaIndex !== -1) {
		icon = iconUrl.substring(lastSlashIndex + 1, commaIndex);
	}
	else if (qMarkIndex !== -1) {
		icon = iconUrl.substring(lastSlashIndex + 1, qMarkIndex);
	}
	else {
		icon = iconUrl.substring(lastSlashIndex + 1);
	}

	const weatherIconKey = icon as keyof typeof weatherIconStatuses;
	const weatherIconStatus = weatherIconStatuses[weatherIconKey];
	return weatherIconStatus || WeatherStatusType.unknown;
}

// Retrieved from https://api.weather.gov/icons
const weatherIconStatuses = {
	"skc": WeatherStatusType.fair,
	"few": WeatherStatusType.cloud_few,
	"sct": WeatherStatusType.cloud_part,
	"bkn": WeatherStatusType.cloud_most,
	"ovc": WeatherStatusType.cloud_over,
	"wind_skc": WeatherStatusType.wind_fair,
	"wind_few": WeatherStatusType.wind_few,
	"wind_sct": WeatherStatusType.wind_part,
	"wind_bkn": WeatherStatusType.wind_most,
	"wind_ovc": WeatherStatusType.wind_over,
	"snow": WeatherStatusType.snow,
	"rain_snow": WeatherStatusType.rain_snow,
	"rain_sleet": WeatherStatusType.rain_sleet,
	"snow_sleet": WeatherStatusType.snow_sleet,
	"fzra": WeatherStatusType.rain_freeze,
	"rain_fzra": WeatherStatusType.rain_freeze_rain,
	"snow_fzra": WeatherStatusType.snow_freeze_rain,
	"sleet": WeatherStatusType.sleet,
	"rain": WeatherStatusType.rain,
	"rain_showers": WeatherStatusType.rain_showers_high,
	"rain_showers_hi": WeatherStatusType.rain_showers,
	"tsra": WeatherStatusType.thun_high,
	"tsra_sct": WeatherStatusType.thun_med,
	"tsra_hi": WeatherStatusType.thun_low,
	"tornado": WeatherStatusType.torn,
	"hurricane": WeatherStatusType.hurr,
	"tropical_storm": WeatherStatusType.trop,
	"dust": WeatherStatusType.dust,
	"smoke": WeatherStatusType.smoke,
	"haze": WeatherStatusType.haze,
	"hot": WeatherStatusType.hot,
	"cold": WeatherStatusType.cold,
	"blizzard": WeatherStatusType.blizz,
	"fog": WeatherStatusType.fog
}