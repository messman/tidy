import * as React from 'react';
import styled from 'styled-components';
import { Icon } from '@/index/core/icon/icon';
import { themeTokens } from '@/index/core/theme/theme-root';
import { icons } from '@wbtdevlocal/assets';

const WeatherIconContainer = styled.span`
	display: inline-block;
	background-color: ${themeTokens.background.tint.medium};
	border-radius: 50%;
	width: 2rem;
	height: 2rem;
	flex-shrink: 0;
`;

export interface DaylightIconProps {
	isDaytime: boolean;
}

export const DaylightIcon: React.FC<DaylightIconProps> = (props) => {
	return (
		<WeatherIconContainer>
			<SunIcon type={props.isDaytime ? icons.weatherSundown : icons.weatherSunrise} />
		</WeatherIconContainer>
	);
};

const SunIcon = styled(Icon)`
	color: ${themeTokens.content.sun};
`;