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
}

export const WeatherIconDayNight: React.FC<WeatherIconDayNightProps> = (props) => {
	const { isDay, status, rain } = props;
	const { day, night } = mapNumberEnumValue(WeatherStatusType, statusTypeDayNight, status);
	return (
		<WeatherIcon type={isDay ? day : night} rain={rain} />
	);
};

const WeatherIcon_Container = styled.div`
	position: relative;
	width: 2.25rem;
	height: 2.25rem;
	display: inline-flex;
	justify-content: center;
	background-color: ${themeTokens.background.tint.darker};
	border-radius: ${borderRadiusSmallerValue};
`;

const WeatherIcon_RainIcon = styled(Icon)`
	margin-top: .125rem;
	width: 1.25rem;
	height: 1.25rem;
`;

const WeatherIcon_Icon = styled(Icon)`
	margin-top: .25rem;
	width: 1.75rem;
	height: 1.75rem;
`;

const WeatherIcon_RainText = styled.div`
	position: absolute;
	bottom: 1px;
	left: 0;
	right: 0;
	text-align: center;
	${fontStyles.text.tinyHeavy};
	color: ${themeTokens.text.subtle};
`;

export interface WeatherIconProps {
	type: IconInputType;
	/** Rain as a percent, [0,100]. 0 does not show. */
	rain: number | null;
}

export const WeatherIcon: StyledFC<WeatherIconProps> = (props) => {
	const { type, rain } = props;

	const IconComponent = rain ? WeatherIcon_RainIcon : WeatherIcon_Icon;
	const rainRender = rain ? (
		<WeatherIcon_RainText>{rain.toString()}%</WeatherIcon_RainText>
	) : null;

	return (
		<WeatherIcon_Container>
			<IconComponent type={type} />
			{rainRender}
		</WeatherIcon_Container>
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