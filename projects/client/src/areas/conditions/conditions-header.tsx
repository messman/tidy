import * as React from 'react';
import { IconTitle } from '@/core/layout/layout';
import { Paragraph } from '@/core/text';
import { Block } from '@/core/theme/box';
import { WeatherStatusIcon } from '@/core/weather/weather-icon';
import { weatherStatusDescription } from '@/services/content/weather-utility';
import { useBatchResponse } from '@/services/data/data';
import { getDurationDescription } from '@/services/time';
import * as iso from '@wbtdevlocal/iso';

export const ConditionsHeader: React.FC = () => {
	const { meta, weather, astro } = useBatchResponse().success!;
	const { next } = astro.sun.relativity;

	const statusDescription = iso.mapNumberEnumValue(iso.Weather.StatusType, weatherStatusDescription, weather.current.status);

	return (
		<>
			<IconTitle iconRender={
				<WeatherStatusIcon isDay={weather.current.isDaytime} status={weather.current.status} />
			}>
				It's {statusDescription.itIsShort} and {Math.round(weather.current.temp)}&deg;.
			</IconTitle>
			<Block.Bat08 />
			<Paragraph>
				{statusDescription.conditions} {next.isRise ? 'Sunrise' : 'Sundown'} is in {getDurationDescription(meta.referenceTime, next.time)}.
			</Paragraph>
		</>
	);
};