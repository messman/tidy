import * as React from 'react';
import styled from 'styled-components';
import { icons } from '@wbtdevlocal/assets';
import { Icon } from '../icon/icon';
import { themeTokens } from '../theme';

const WeatherIconContainer = styled.span`
	display: inline-block;
	background-color: ${themeTokens.content.backgroundDay};
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