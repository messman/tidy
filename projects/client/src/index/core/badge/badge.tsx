import * as React from 'react';
import styled from 'styled-components';
import { DaylightIcon } from '@/index/content/common/astro/daylight-icon';
import { TideLevelIcon } from '@/index/content/common/tide/tide-level-icon';
import { WeatherIconDayNightProps } from '@/index/content/common/weather/weather-icon';
import { TidePoint } from '@wbtdevlocal/iso';
import { FontWeight, Spacing } from '../primitive/primitive-design';
import { fontStyles } from '../text/text-shared';

export interface WeatherBadgeProps extends WeatherIconDayNightProps {
	children: React.ReactNode;
}

export const WeatherBadge: React.FC<WeatherBadgeProps> = (props) => {
	const { children } = props;
	return (
		<BadgeContainer>
			{/* <WeatherIconDayNight status={status} isDay={isDay} /> */}
			<BadgeText>{children}</BadgeText>
		</BadgeContainer>
	);
};

export interface TideLevelBadgeProps {
	tide: TidePoint;
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
	border-radius: 2rem;
`;

const BadgeText = styled.div`
	display: inline-block;
	margin-left: ${Spacing.ant04};
	margin-right: ${Spacing.bat08};
	${fontStyles.text.small};
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