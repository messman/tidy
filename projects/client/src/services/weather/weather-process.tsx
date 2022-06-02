import { DateTime } from 'luxon';
import { IconInputType } from '@/core/icon/icon';
import { icons } from '@wbtdevlocal/assets';
import * as iso from '@wbtdevlocal/iso';

export function filterWeather(statuses: iso.Weather.WeatherStatus[], referenceTime: DateTime, cutOffHoursFromReference: number, cutoffDate: DateTime): iso.Weather.WeatherStatus[] {
	// Filter out status if it's too close to our reference time or after our cutoff.
	// Note - only weather deals with the reference time. Other bars may use start time.
	const referenceTimePlusCutoff = referenceTime.plus({ hours: cutOffHoursFromReference });
	return statuses.filter((weatherStatus) => {
		return (weatherStatus.time > referenceTimePlusCutoff) && (weatherStatus.time < cutoffDate);
	});
}

export interface WeatherDisplay {
	tempText: string;
	windText: string;
	windDirectionUnit: string;
	icon: IconInputType;
	shortStatusText: string;
	pressureText: string;
}

export function processWeatherForDisplay(weatherStatus: iso.Weather.WeatherStatus, useDayIcon: boolean): WeatherDisplay {

	const { temp, status, wind, windDirection, pressure } = weatherStatus;

	const weatherStatusKey = iso.keyForEnumValue(iso.Weather.WeatherStatusType, status);
	// Use that key to get the icons (day and night).
	const weatherStatusIcon = weatherStatusTypeIcon[weatherStatusKey];
	// Choose between day and night based on the sun event.
	const weatherStatusIconForTime = useDayIcon ? weatherStatusIcon.day : weatherStatusIcon.night;

	const weatherDisplay: WeatherDisplay = {
		tempText: Math.round(temp).toString(),
		windText: Math.round(wind).toString(),
		windDirectionUnit: iso.Weather.WindDirection[windDirection],
		icon: weatherStatusIconForTime,
		shortStatusText: iso.Weather.weatherStatusTypeDescription[weatherStatusKey].short,
		pressureText: Math.round(pressure).toString()
	};

	return weatherDisplay;
}

export interface DailyWeatherDisplay {
	minTempText: string;
	maxTempText: string;
	icon: IconInputType;
	shortStatusText: string;
	longStatusText: string;
}

export function processDailyWeatherForDisplay(dailyWeather: iso.Weather.DailyWeather): DailyWeatherDisplay {

	const { minTemp, maxTemp, status } = dailyWeather;

	const weatherStatusKey = iso.keyForEnumValue(iso.Weather.WeatherStatusType, status);
	// Use that key to get the icons (day and night).
	const weatherStatusIcon = weatherStatusTypeIcon[weatherStatusKey];
	// For the day, always use the day icon.
	const weatherStatusIconForTime = weatherStatusIcon.day;

	const description = iso.Weather.weatherStatusTypeDescription[weatherStatusKey];

	return {
		minTempText: Math.round(minTemp).toString(),
		maxTempText: Math.round(maxTemp).toString(),
		icon: weatherStatusIconForTime,
		shortStatusText: description.short,
		longStatusText: description.long,
	};
}

export interface WeatherStatusIcon {
	day: IconInputType;
	night: IconInputType;
}
export type WeatherStatusIconMap = Record<keyof typeof iso.Weather.WeatherStatusType, WeatherStatusIcon>;
export const weatherStatusTypeIcon: WeatherStatusIconMap = {
	unknown: {
		day: icons.weatherQuestion,
		night: icons.weatherQuestion
	},
	clear: {
		day: icons.weatherSun,
		night: icons.weatherMoon
	},
	clear_hot: {
		day: icons.weatherTemperatureHot,
		night: icons.weatherTemperatureHot
	},
	clear_cold: {
		day: icons.weatherTemperatureCold,
		night: icons.weatherTemperatureCold
	},
	clouds_few: {
		day: icons.weatherCloudySun,
		night: icons.weatherCloudyMoon
	},
	clouds_some: {
		day: icons.weatherCloudySun,
		night: icons.weatherCloudyMoon
	},
	clouds_most: {
		day: icons.weatherCloud,
		night: icons.weatherCloud
	},
	clouds_over: {
		day: icons.weatherClouds,
		night: icons.weatherClouds
	},
	rain_drizzle: {
		day: icons.weatherRainSun,
		night: icons.weatherRainMoon
	},
	rain_light: {
		day: icons.weatherRainSun,
		night: icons.weatherRainMoon
	},
	rain_medium: {
		day: icons.weatherRain,
		night: icons.weatherRain
	},
	rain_heavy: {
		day: icons.weatherRain,
		night: icons.weatherRain
	},
	rain_freeze: {
		day: icons.weatherHail,
		night: icons.weatherHail
	},
	snow_light: {
		day: icons.weatherSnowflake,
		night: icons.weatherSnowflake
	},
	snow_medium: {
		day: icons.weatherSnowflake,
		night: icons.weatherSnowflake
	},
	snow_heavy: {
		day: icons.weatherSnowflake,
		night: icons.weatherSnowflake
	},
	snow_sleet: {
		day: icons.weatherSnowflake,
		night: icons.weatherSnowflake
	},
	snow_rain: {
		day: icons.weatherSnowflake,
		night: icons.weatherSnowflake
	},
	thun_light: {
		day: icons.weatherLightningSun,
		night: icons.weatherLightningMoon
	},
	thun_medium: {
		day: icons.weatherLightning,
		night: icons.weatherLightning
	},
	thun_heavy: {
		day: icons.weatherLightning,
		night: icons.weatherLightning
	},
	intense_storm: {
		day: icons.statusAlertSolid,
		night: icons.statusAlertSolid
	},
	intense_other: {
		day: icons.statusAlertSolid,
		night: icons.statusAlertSolid
	},
	dust: {
		day: icons.statusAlertSolid,
		night: icons.statusAlertSolid
	},
	smoke: {
		day: icons.statusAlertSolid,
		night: icons.statusAlertSolid
	},
	haze: {
		day: icons.weatherFog,
		night: icons.weatherFog
	},
	fog: {
		day: icons.weatherFog,
		night: icons.weatherFog
	}
};