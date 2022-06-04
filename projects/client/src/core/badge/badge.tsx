import * as React from 'react';
import * as iso from '@wbtdevlocal/iso';
import { IconInputType } from '../icon/icon';
import { fontStyleDeclarations } from '../text';
import { Spacing } from '../theme/box';
import { FontWeight } from '../theme/font';
import { styled } from '../theme/styled';
import { TideLevelIcon } from '../tide/tide-level-icon';
import { DaylightIcon, WeatherIcon } from '../weather/weather-icon';

export interface WeatherBadgeProps {
	icon: IconInputType;
}

export const WeatherBadge: React.FC<WeatherBadgeProps> = (props) => {
	const { children, icon } = props;
	return (
		<BadgeContainer>
			<WeatherIcon type={icon} />
			<BadgeText>{children}</BadgeText>
		</BadgeContainer>
	);
};

export interface TideLevelBadgeProps {
	level: iso.Tide.CurrentTide;
}

export const TideLevelBadge: React.FC<TideLevelBadgeProps> = (props) => {
	const { children, level } = props;
	return (
		<BadgeContainer>
			<TideLevelIcon level={level} />
			<BadgeText>{children}</BadgeText>
		</BadgeContainer>
	);
};

export interface DaylightBadgeProps {
	isDaytime: boolean;
}

export const DaylightBadge: React.FC<DaylightBadgeProps> = (props) => {
	const { children, isDaytime } = props;
	return (
		<BadgeContainer>
			<DaylightIcon isDaytime={isDaytime} />
			<BadgeText>{children}</BadgeText>
		</BadgeContainer>
	);
};

const BadgeContainer = styled.div`
	display: inline-flex;
	align-items: center;
	background-color: ${p => p.theme.badge.textBackground};
	border-radius: 2rem;
`;

const BadgeText = styled.div`
	display: inline-block;
	margin-left: ${Spacing.ant04};
	margin-right: ${Spacing.bat08};
	${fontStyleDeclarations.small};
	font-weight: ${FontWeight.medium};
`;

export const BadgeCollection = styled.div`
	margin-bottom: ${Spacing.bat08};

	${BadgeContainer} {
		margin-top: ${Spacing.bat08};
		margin-right: ${Spacing.bat08};
	}

	${BadgeContainer}:last-of-type {
		margin-right: 0;
	}
`;