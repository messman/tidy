import * as React from 'react';
import { styled } from '@/core/style/styled';
import { WeatherStatusType } from 'tidy-shared';

export type SVGIconType = React.FC<React.SVGAttributes<SVGElement>>;

const Sunset = require('@/static/icons/sunset.svg').default as SVGIconType;
const Sunrise = require('@/static/icons/sunrise.svg').default as SVGIconType;
const Sun = require('@/static/icons/sun.svg').default as SVGIconType;
const Moon = require('@/static/icons/moon.svg').default as SVGIconType;
const CloudySun = require('@/static/icons/cloudy-sun.svg').default as SVGIconType;
const CloudyMoon = require('@/static/icons/cloudy-moon.svg').default as SVGIconType;
const Cloud = require('@/static/icons/cloud.svg').default as SVGIconType;
const Clouds = require('@/static/icons/clouds.svg').default as SVGIconType;
const Wind = require('@/static/icons/wind.svg').default as SVGIconType;
const CloudyWind = require('@/static/icons/cloudy-wind.svg').default as SVGIconType;
const Snowflake = require('@/static/icons/snowflake.svg').default as SVGIconType;
const Hail = require('@/static/icons/hail.svg').default as SVGIconType;
const Rain = require('@/static/icons/rain.svg').default as SVGIconType;
const RainSun = require('@/static/icons/rain-sun.svg').default as SVGIconType;
const RainMoon = require('@/static/icons/rain-moon.svg').default as SVGIconType;
const Lightning = require('@/static/icons/lightning.svg').default as SVGIconType;
const LightningSun = require('@/static/icons/lightning-sun.svg').default as SVGIconType;
const LightningMoon = require('@/static/icons/lightning-moon.svg').default as SVGIconType;
const Fog = require('@/static/icons/fog.svg').default as SVGIconType;
const WeatherAlert = require('@/static/icons/weather-alert.svg').default as SVGIconType;
const Question = require('@/static/icons/question.svg').default as SVGIconType;
const TemperatureHot = require('@/static/icons/temperature-hot.svg').default as SVGIconType;
const Temperature = require('@/static/icons/temperature.svg').default as SVGIconType;
const TemperatureCold = require('@/static/icons/temperature-cold.svg').default as SVGIconType;
const Alert = require('@/static/icons/alert.svg').default as SVGIconType;
const Calendar = require('@/static/icons/calendar.svg').default as SVGIconType;
const Clipboard = require('@/static/icons/clipboard.svg').default as SVGIconType;
const ClipboardCheck = require('@/static/icons/clipboard-check.svg').default as SVGIconType;
const Gear = require('@/static/icons/gear.svg').default as SVGIconType;
const Reload = require('@/static/icons/reload.svg').default as SVGIconType;
const ChevronLeft = require('@/static/icons/chevron-left.svg').default as SVGIconType;
const ArrowDown = require('@/static/icons/arrow-down.svg').default as SVGIconType;
const ArrowUp = require('@/static/icons/arrow-up.svg').default as SVGIconType;

export const iconTypes = {
	sunset: Sunset,
	sunrise: Sunrise,
	sun: Sun,
	moon: Moon,
	cloudySun: CloudySun,
	cloudyMoon: CloudyMoon,
	cloud: Cloud,
	clouds: Clouds,
	wind: Wind,
	cloudyWind: CloudyWind,
	snowflake: Snowflake,
	hail: Hail,
	rain: Rain,
	rainSun: RainSun,
	rainMoon: RainMoon,
	lightning: Lightning,
	lightningSun: LightningSun,
	lightningMoon: LightningMoon,
	fog: Fog,
	weatherAlert: WeatherAlert,
	question: Question,
	temperatureHot: TemperatureHot,
	temperature: Temperature,
	temperatureCold: TemperatureCold,
	alert: Alert,
	calendar: Calendar,
	clipboard: Clipboard,
	clipboardCheck: ClipboardCheck,
	gear: Gear,
	reload: Reload,
	chevronLeft: ChevronLeft,
	arrowDown: ArrowDown,
	arrowUp: ArrowUp,
}

export interface IconProps {
	type: SVGIconType,
	fill?: string,
	width?: string | number,
	height?: string | number
}

export const Icon: React.FC<IconProps> = (props) => {

	// Get the width and height props separately. If we use spread, 
	const { type, fill, ...widthAndHeightProps } = props;
	const SVGIcon = type;

	return (
		<SVGWrapper fill={fill}>
			<SVGIcon {...widthAndHeightProps} />
		</SVGWrapper>
	);
}

interface SVGWrapperProps {
	fill?: string
}

const SVGWrapper = styled.span<SVGWrapperProps>`
	display: inline-block;

	svg, svg path {
		fill: ${p => (p.fill || p.theme.color.textAndIcon)};
	}
`;

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