import * as React from 'react';
import { BadgeCollection, DaylightBadge, TideLevelBadge, WeatherBadge } from '@/core/badge/badge';
import * as iso from '@wbtdevlocal/iso';

export const BeachTimeBadges: React.FC = () => {
	return (
		<BadgeCollection>
			<WeatherBadge status={iso.Weather.StatusType.clouds_some} isDay={true}>79&deg;</WeatherBadge>
			<TideLevelBadge tide={{ height: 0, time: null!, direction: iso.Tide.Direction.rising, division: iso.Tide.Division.low }}>Rising</TideLevelBadge>
			<DaylightBadge isDaytime={true}>
				6h 4m
			</DaylightBadge>
		</BadgeCollection>
	);
};