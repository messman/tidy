import * as React from 'react';
import { useBatchResponse } from '@/index/core/data/data';
import { Block } from '@/index/core/layout/layout-shared';
import { MediumBodyText } from '@/index/core/text/text-shared';
import { getDurationDescription } from '@/index/core/time/time';
import { mapNumberEnumValue, WeatherStatusType } from '@wbtdevlocal/iso';
import { weatherStatusDescription } from './weather-utility';

export const ConditionsHeader: React.FC = () => {
	const { meta, weather, astro } = useBatchResponse().success!;
	const { next } = astro.sun.relativity;

	const statusDescription = mapNumberEnumValue(WeatherStatusType, weatherStatusDescription, weather.current.status);

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