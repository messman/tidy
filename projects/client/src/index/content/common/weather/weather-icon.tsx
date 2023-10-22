import * as React from 'react';
import styled from 'styled-components';
import { Icon, IconInputType } from '@/index/core/icon/icon';
import { borderRadiusSmallerValue } from '@/index/core/primitive/primitive-design';
import { StyledFC } from '@/index/core/primitive/primitive-styled';
import { fontStyles } from '@/index/core/text/text-shared';
import { themeTokens } from '@/index/core/theme/theme-root';
import { icons } from '@wbtdevlocal/assets';
import { mapNumberEnumValue, WeatherStatusType } from '@wbtdevlocal/iso';

export interface WeatherIconDayNightProps {
	status: WeatherStatusType;
	isDay: boolean;
	/** Rain as a percent, [0,100]. 0 does not show. */
	rain: number | null;
	isTransparent?: boolean;
}

export const WeatherIconDayNight: StyledFC<WeatherIconDayNightProps> = (props) => {
	const { isDay, status, rain, isTransparent, className } = props;
	const { day, night } = mapNumberEnumValue(WeatherStatusType, statusTypeDayNight, status);
	return (
		<WeatherIcon type={isDay ? day : night} rain={rain} className={className} isTransparent={isTransparent} />
	);
};

const Container = styled.div`
	position: relative;
	width: 2rem;
	height: 2rem;
	flex-shrink: 0;
	display: inline-flex;
	justify-content: center;
	border-radius: ${borderRadiusSmallerValue};
	background-color: ${themeTokens.background.tint.darker};
`;

const ContainerTransparent = styled(Container)`
	background-color: transparent;
`;

const WeatherIcon_RainIcon = styled(Icon)`
	margin-top: 3.125%;
	width: 62.5%;
	height: 62.5%;
`;

const WeatherIcon_Icon = styled(Icon)`
	margin-top: 9.375%; // 3 / 32
	width: 81.25%; // 26 / 32
	height: 81.25%;
`;

const WeatherIcon_RainText = styled.div`
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	text-align: center;
	${fontStyles.text.tinyHeavy};
	line-height: .75rem;
	color: ${themeTokens.text.subtle};
`;

export interface WeatherIconProps {
	type: IconInputType;
	/** Rain as a percent, [0,100]. 0 does not show. */
	rain: number | null;
	isTransparent?: boolean;
}

export const WeatherIcon: StyledFC<WeatherIconProps> = (props) => {
	const { type, rain, isTransparent = false, className } = props;

	const IconComponent = rain ? WeatherIcon_RainIcon : WeatherIcon_Icon;
	const rainRender = rain ? (
		<WeatherIcon_RainText>{rain.toString()}%</WeatherIcon_RainText>
	) : null;

	const Component = isTransparent ? ContainerTransparent : Container;

	return (
		<Component className={className}>
			<IconComponent type={type} />
			{rainRender}
		</Component>
	);
};



export interface WeatherStatusTypeDayNight {
	day: IconInputType;
	night: IconInputType;
}
export const statusTypeDayNight: Record<keyof typeof WeatherStatusType, WeatherStatusTypeDayNight> = {
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
		day: icons.weatherSun,
		night: icons.weatherMoon
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
		day: icons.informWarningSolid,
		night: icons.informWarningSolid
	},
	intense_other: {
		day: icons.informWarningSolid,
		night: icons.informWarningSolid
	},
	dust: {
		day: icons.informWarningSolid,
		night: icons.informWarningSolid
	},
	smoke: {
		day: icons.informWarningSolid,
		night: icons.informWarningSolid
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