import * as React from 'react';
import { IconTitle } from '@/core/layout/layout';
import { Paragraph } from '@/core/text';
import { Block } from '@/core/theme/box';
import { WeatherStatusIcon } from '@/core/weather/weather-icon';
import { weatherStatusDescription } from '@/services/content/weather-utility';
import { useBatchResponse } from '@/services/data/data';
import * as iso from '@wbtdevlocal/iso';

export const ConditionsHeader: React.FC = () => {
	const { weather } = useBatchResponse().success!;

	const statusDescription = iso.mapEnumValue(iso.Weather.StatusType, weatherStatusDescription, weather.current.status);

	return (
		<>
			<IconTitle icon={
				<WeatherStatusIcon isDay={weather.current.isDaytime} status={weather.current.status} />
			}>
				It's {statusDescription.itIsShort} and {Math.round(weather.current.temp)}&deg;.
			</IconTitle>
			<Block.Bat08 />
			<Paragraph>
				{statusDescription.conditions}
			</Paragraph>
		</>
	);
};