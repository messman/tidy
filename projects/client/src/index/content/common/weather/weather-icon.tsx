import * as React from 'react';
import styled from 'styled-components';
import { defaultIconSvgStyle, Icon, IconInputType, IconProps } from '@/index/core/icon/icon';
import { StyledFC } from '@/index/core/primitive/primitive-styled';
import { icons } from '@wbtdevlocal/assets';
import * as iso from '@wbtdevlocal/iso';

export interface WeatherStatusIconProps {
	status: iso.Weather.StatusType;
	isDay: boolean;
}

export const WeatherStatusIcon: React.FC<WeatherStatusIconProps> = (props) => {
	const { isDay, status } = props;
	const statusTypeIcon = iso.mapNumberEnumValue(iso.Weather.StatusType, statusTypeIconMap, status);
	return (
		<BaseWeatherIcon type={isDay ? statusTypeIcon.day : statusTypeIcon.night} />
	);
};

export const BaseWeatherIcon: StyledFC<IconProps> = (props) => {
	return (
		<WeatherIconContainer>
			<Icon {...props} />
		</WeatherIconContainer>
	);
};

const WeatherIconContainer = styled.span`
	${defaultIconSvgStyle};
	display: inline-block;
	border-radius: 50%;
	width: 2rem;
	height: 2rem;
	flex-shrink: 0;
`;

// export function isDay(eventTime: DateTime, day: iso.Astro.SunDay): boolean {
// 	return eventTime >= day.rise && eventTime <= day.set;
// }

export interface StatusTypeIcon {
	day: IconInputType;
	night: IconInputType;
}
export const statusTypeIconMap: Record<keyof typeof iso.Weather.StatusType, StatusTypeIcon> = {
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