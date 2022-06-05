import * as React from 'react';
import { BadgeCollection, DaylightBadge, TideLevelBadge, WeatherBadge } from '@/core/badge/badge';
import { icons } from '@wbtdevlocal/assets';
import * as iso from '@wbtdevlocal/iso';

export const BeachTimeBadges: React.FC = () => {
	return (
		<BadgeCollection>
			<WeatherBadge icon={icons.weatherCloudySun}>79&deg;</WeatherBadge>
			<TideLevelBadge level={{ height: 0, direction: iso.Tide.TideDirection.rising, division: iso.Tide.TideDivision.low }}>Rising</TideLevelBadge>
			<DaylightBadge isDaytime={true}>
				6h 4m
			</DaylightBadge>
		</BadgeCollection>
	);
};