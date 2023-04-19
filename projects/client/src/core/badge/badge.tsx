import * as React from 'react';
import styled from 'styled-components';
import * as iso from '@wbtdevlocal/iso';
import { DaylightIcon } from '../astro/daylight-icon';
import { fontStyleDeclarations } from '../text';
import { Spacing } from '../theme/box';
import { FontWeight } from '../theme/font';
import { TideLevelIcon } from '../tide/tide-level-icon';
import { WeatherStatusIcon, WeatherStatusIconProps } from '../weather/weather-icon';

export interface WeatherBadgeProps extends WeatherStatusIconProps {
	children: React.ReactNode;
}

export const WeatherBadge: React.FC<WeatherBadgeProps> = (props) => {
	const { children, status, isDay } = props;
	return (
		<BadgeContainer>
			<WeatherStatusIcon status={status} isDay={isDay} />
			<BadgeText>{children}</BadgeText>
		</BadgeContainer>
	);
};

export interface TideLevelBadgeProps {
	tide: iso.Tide.MeasureStamp;
	children: React.ReactNode;
}

export const TideLevelBadge: React.FC<TideLevelBadgeProps> = (props) => {
	const { children, tide } = props;
	return (
		<BadgeContainer>
			<TideLevelIcon tide={tide} />
			<BadgeText>{children}</BadgeText>
		</BadgeContainer>
	);
};

export interface DaylightBadgeProps {
	isDaytime: boolean;
	children: React.ReactNode;
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