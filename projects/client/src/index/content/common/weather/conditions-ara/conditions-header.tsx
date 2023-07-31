import * as React from 'react';
import { Block } from '@/index/core/layout/layout-shared';
import { MediumBodyText } from '@/index/core/text/text-shared';
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
			{/* <IconTitle iconRender={
				<WeatherStatusIcon isDay={weather.current.isDaytime} status={weather.current.status} />
			}>
			</IconTitle> */}
			It's {statusDescription.itIsShort} and {Math.round(weather.current.temp)}&deg;.
			<Block.Bat08 />
			<MediumBodyText>
				{statusDescription.conditions} {next.isRise ? 'Sunrise' : 'Sundown'} is in {getDurationDescription(meta.referenceTime, next.time)}.
			</MediumBodyText>
		</>
	);
};