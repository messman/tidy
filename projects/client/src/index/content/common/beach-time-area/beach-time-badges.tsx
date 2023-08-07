import * as React from 'react';
import { BadgeCollection, DaylightBadge, TideLevelBadge, WeatherBadge } from '@/index/core/badge/badge';
import { useBatchResponse } from '@/index/core/data/data';
import { TimeDurationTextUnit } from '@/index/core/text/text-unit';
import { getTideDescription } from '../tide/tide-utility';

export const BeachTimeBadges: React.FC = () => {
	const { astro, meta, weather, tide } = useBatchResponse().success!;
	const { isRise: isNextSunEventRise, time: nextSunEventTime } = astro.sun.relativity.next;

	return (
		<BadgeCollection>
			<WeatherBadge status={weather.current.status} isDay={!isNextSunEventRise}>{Math.round(weather.current.temp)}&deg;</WeatherBadge>
			<TideLevelBadge tide={tide.measured}>{getTideDescription(tide.measured)}</TideLevelBadge>
			<DaylightBadge isDaytime={!isNextSunEventRise}>
				<TimeDurationTextUnit startTime={meta.referenceTime} stopTime={nextSunEventTime} />
			</DaylightBadge>
		</BadgeCollection>
	);
};