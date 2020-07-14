import { DateTime } from 'luxon';
import { DailyWeather, WeatherStatus, WeatherStatusType, weatherStatusTypeDescription, WindDirection } from 'tidy-shared';
import { iconTypes, SVGIconType } from '@/core/symbol/icon';

export function filterWeather(statuses: WeatherStatus[], referenceTime: DateTime, cutOffHoursFromReference: number, cutoffDate: DateTime): WeatherStatus[] {
	// Filter out status if it's too close to our reference time or after our cutoff.
	// Note - only weather deals with the reference time. Other bars may use start time.
	const referenceTimePlusCutoff = referenceTime.plus({ hours: cutOffHoursFromReference });
	return statuses.filter((weatherStatus) => {
		return (weatherStatus.time > referenceTimePlusCutoff) && (weatherStatus.time < cutoffDate);
	});
}

/** Gets the key/name, like 'unknown'. */
function getWeatherStatusKey(status: WeatherStatusType): keyof typeof WeatherStatusType {
	return WeatherStatusType[status] as keyof typeof WeatherStatusType;
}

export interface WeatherDisplay {
	tempText: string;
	windText: string;
	windDirectionUnit: string;
	icon: SVGIconType;
	shortStatusText: string;
	pressureText: string;
}

export function processWeatherForDisplay(weatherStatus: WeatherStatus, useDayIcon: boolean): WeatherDisplay {

	const { temp, status, wind, windDirection, pressure } = weatherStatus;

	const weatherStatusKey = getWeatherStatusKey(status);
	// Use that key to get the icons (day and night).
	const weatherStatusIcon = weatherStatusTypeIcon[weatherStatusKey];
	// Choose between day and night based on the sun event.
	const weatherStatusIconForTime = useDayIcon ? weatherStatusIcon.day : weatherStatusIcon.night;

	const weatherDisplay: WeatherDisplay = {
		tempText: Math.round(temp.entity!).toString(),
		windText: Math.round(wind.entity!).toString(),
		windDirectionUnit: `mph ${WindDirection[windDirection]}`,
		icon: weatherStatusIconForTime,
		shortStatusText: weatherStatusTypeDescription[weatherStatusKey].short,
		pressureText: Math.round(pressure.entity!).toString()
	};

	return weatherDisplay;
}

export interface DailyWeatherDisplay {
	minTempText: string;
	maxTempText: string;
	icon: SVGIconType;
	shortStatusText: string;
	longStatusText: string;
}

export function processDailyWeatherForDisplay(dailyWeather: DailyWeather): DailyWeatherDisplay {

	const { minTemp, maxTemp, status } = dailyWeather;

	const weatherStatusKey = getWeatherStatusKey(status);
	// Use that key to get the icons (day and night).
	const weatherStatusIcon = weatherStatusTypeIcon[weatherStatusKey];
	// FOr the day, always use the day icon.
	const weatherStatusIconForTime = weatherStatusIcon.day;


	return {
		minTempText: Math.round(minTemp).toString(),
		maxTempText: Math.round(maxTemp).toString(),
		icon: weatherStatusIconForTime,
		shortStatusText: weatherStatusTypeDescription[weatherStatusKey].short,
		longStatusText: weatherStatusTypeDescription[weatherStatusKey].long,
	};
}

export interface WeatherStatusIcon {
	day: SVGIconType,
	night: SVGIconType;
}
export type WeatherStatusIconMap = Record<keyof typeof WeatherStatusType, WeatherStatusIcon>;
export const weatherStatusTypeIcon: WeatherStatusIconMap = {
	unknown: {
		day: iconTypes.question,
		night: iconTypes.question
	},
	clear: {
		day: iconTypes.sun,
		night: iconTypes.moon
	},
	clear_hot: {
		day: iconTypes.temperatureHot,
		night: iconTypes.temperatureHot
	},
	clear_cold: {
		day: iconTypes.temperatureCold,
		night: iconTypes.temperatureCold
	},
	clouds_few: {
		day: iconTypes.cloudySun,
		night: iconTypes.cloudyMoon
	},
	clouds_some: {
		day: iconTypes.cloudySun,
		night: iconTypes.cloudyMoon
	},
	clouds_most: {
		day: iconTypes.cloud,
		night: iconTypes.cloud
	},
	clouds_over: {
		day: iconTypes.clouds,
		night: iconTypes.clouds
	},
	rain_drizzle: {
		day: iconTypes.rainSun,
		night: iconTypes.rainMoon
	},
	rain_light: {
		day: iconTypes.rainSun,
		night: iconTypes.rainMoon
	},
	rain_medium: {
		day: iconTypes.rain,
		night: iconTypes.rain
	},
	rain_heavy: {
		day: iconTypes.rain,
		night: iconTypes.rain
	},
	rain_freeze: {
		day: iconTypes.hail,
		night: iconTypes.hail
	},
	snow_light: {
		day: iconTypes.snowflake,
		night: iconTypes.snowflake
	},
	snow_medium: {
		day: iconTypes.snowflake,
		night: iconTypes.snowflake
	},
	snow_heavy: {
		day: iconTypes.snowflake,
		night: iconTypes.snowflake
	},
	snow_sleet: {
		day: iconTypes.snowflake,
		night: iconTypes.snowflake
	},
	snow_rain: {
		day: iconTypes.snowflake,
		night: iconTypes.snowflake
	},
	thun_light: {
		day: iconTypes.lightningSun,
		night: iconTypes.lightningMoon
	},
	thun_medium: {
		day: iconTypes.lightning,
		night: iconTypes.lightning
	},
	thun_heavy: {
		day: iconTypes.lightning,
		night: iconTypes.lightning
	},
	intense_storm: {
		day: iconTypes.weatherAlert,
		night: iconTypes.weatherAlert
	},
	intense_other: {
		day: iconTypes.weatherAlert,
		night: iconTypes.weatherAlert
	},
	dust: {
		day: iconTypes.weatherAlert,
		night: iconTypes.weatherAlert
	},
	smoke: {
		day: iconTypes.weatherAlert,
		night: iconTypes.weatherAlert
	},
	haze: {
		day: iconTypes.fog,
		night: iconTypes.fog
	},
	fog: {
		day: iconTypes.fog,
		night: iconTypes.fog
	}
};