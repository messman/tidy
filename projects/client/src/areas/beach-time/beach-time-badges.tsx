import * as React from 'react';
import { BadgeCollection, DaylightBadge, TideLevelBadge, WeatherBadge } from '@/core/badge/badge';
import { TimeDurationTextUnit } from '@/core/text-unit';
import { getTideDescription } from '@/services/content/tide-utility';
import { useBatchResponse } from '@/services/data/data';

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