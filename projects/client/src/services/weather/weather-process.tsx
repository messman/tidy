import { WeatherStatus, WeatherStatusType, WindDirection, weatherStatusTypeDescription } from 'tidy-shared';
import { SVGIconType, iconTypes } from '@/core/symbol/icon';

export interface WeatherDisplay {
	tempText: string,
	windText: string,
	windDirectionUnit: string,
	icon: SVGIconType
	shortStatusText: string,
	chanceRainText: string
}

export function processWeatherForDisplay(weatherStatus: WeatherStatus, useDayIcon: boolean): WeatherDisplay {

	const { temp, status, wind, windDirection, chanceRain } = weatherStatus;

	// Get the key, like 'unknown'.
	const weatherStatusKey = WeatherStatusType[status] as keyof typeof WeatherStatusType;
	// Use that key to get the icons (day and night).
	const weatherStatusIcon = weatherStatusTypeIcon[weatherStatusKey];
	// Choose between day and night based on the sun event.
	const weatherStatusIconForTime = useDayIcon ? weatherStatusIcon.day : weatherStatusIcon.night;

	const chanceRainPercent = Math.round(chanceRain.entity! * 100);
	const chanceRainPercentString = `${chanceRainPercent}%`;

	const weatherDisplay: WeatherDisplay = {
		tempText: Math.round(temp.entity!).toString(),
		windText: Math.round(wind.entity!).toString(),
		windDirectionUnit: `mph ${WindDirection[windDirection]}`,
		icon: weatherStatusIconForTime,
		shortStatusText: weatherStatusTypeDescription[weatherStatusKey].short,
		chanceRainText: chanceRainPercentString
	};

	return weatherDisplay;
}

export interface WeatherStatusIcon {
	day: SVGIconType,
	night: SVGIconType
}
export type WeatherStatusIconMap = Record<keyof typeof WeatherStatusType, WeatherStatusIcon>;
export const weatherStatusTypeIcon: WeatherStatusIconMap = {
	unknown: {
		day: iconTypes.question,
		night: iconTypes.question
	},
	fair: {
		day: iconTypes.sun,
		night: iconTypes.moon
	},
	cloud_few: {
		day: iconTypes.cloudySun,
		night: iconTypes.cloudyMoon
	},
	cloud_part: {
		day: iconTypes.cloudySun,
		night: iconTypes.cloudyMoon
	},
	cloud_most: {
		day: iconTypes.cloud,
		night: iconTypes.cloud
	},
	cloud_over: {
		day: iconTypes.clouds,
		night: iconTypes.clouds
	},
	wind_fair: {
		day: iconTypes.wind,
		night: iconTypes.wind
	},
	wind_few: {
		day: iconTypes.wind,
		night: iconTypes.wind
	},
	wind_part: {
		day: iconTypes.cloudyWind,
		night: iconTypes.cloudyWind
	},
	wind_most: {
		day: iconTypes.cloudyWind,
		night: iconTypes.cloudyWind
	},
	wind_over: {
		day: iconTypes.cloudyWind,
		night: iconTypes.cloudyWind
	},
	snow: {
		day: iconTypes.snowflake,
		night: iconTypes.snowflake
	},
	rain_snow: {
		day: iconTypes.rain,
		night: iconTypes.rain
	},
	rain_sleet: {
		day: iconTypes.rain,
		night: iconTypes.rain
	},
	snow_sleet: {
		day: iconTypes.snowflake,
		night: iconTypes.snowflake
	},
	rain_freeze: {
		day: iconTypes.hail,
		night: iconTypes.hail
	},
	rain_freeze_rain: {
		day: iconTypes.hail,
		night: iconTypes.hail
	},
	snow_freeze_rain: {
		day: iconTypes.hail,
		night: iconTypes.hail
	},
	sleet: {
		day: iconTypes.snowflake,
		night: iconTypes.snowflake
	},
	rain: {
		day: iconTypes.rain,
		night: iconTypes.rain
	},
	rain_showers_high: {
		day: iconTypes.rain,
		night: iconTypes.rain
	},
	rain_showers: {
		day: iconTypes.rainSun,
		night: iconTypes.rainMoon
	},
	thun_high: {
		day: iconTypes.lightning,
		night: iconTypes.lightning
	},
	thun_med: {
		day: iconTypes.lightning,
		night: iconTypes.lightning
	},
	thun_low: {
		day: iconTypes.lightningSun,
		night: iconTypes.lightningMoon
	},
	torn: {
		day: iconTypes.weatherAlert,
		night: iconTypes.weatherAlert
	},
	hurr: {
		day: iconTypes.weatherAlert,
		night: iconTypes.weatherAlert
	},
	trop: {
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
	hot: {
		day: iconTypes.temperatureHot,
		night: iconTypes.temperatureHot
	},
	cold: {
		day: iconTypes.temperatureCold,
		night: iconTypes.temperatureCold
	},
	blizz: {
		day: iconTypes.snowflake,
		night: iconTypes.snowflake
	},
	fog: {
		day: iconTypes.fog,
		night: iconTypes.fog
	}
};