import * as React from 'react';
import { icons } from '@wbtdevlocal/assets';
import { Icon, IconProps } from '../icon/icon';
import { styled, StyledFC } from '../theme/styled';

export const WeatherIcon: StyledFC<IconProps> = (props) => {
	return (
		<WeatherIconContainer>
			<Icon {...props} />
		</WeatherIconContainer>
	);
};

const WeatherIconContainer = styled.span`
	display: inline-block;
	background-color: ${p => p.theme.common.content.background};
	border-radius: 50%;

	${Icon as any} {
		width: 2rem;
		height: 2rem;
	}
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
	color: ${p => p.theme.common.content.sun};
`;