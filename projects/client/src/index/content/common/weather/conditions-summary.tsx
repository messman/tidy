import * as React from 'react';
import styled from 'styled-components';
import { wrapForBatchLoad } from '@/index/core/data/batch-load-control';
import { useBatchResponse } from '@/index/core/data/data';
import { ErrorGeneric } from '@/index/core/error/error-generic';
import { Block } from '@/index/core/layout/layout-shared';
import { Panel } from '@/index/core/layout/panel';
import { MediumBodyText } from '@/index/core/text/text-shared';
import { getDurationDescription } from '@/index/core/time/time';
import { mapNumberEnumValue, WeatherStatusType } from '@wbtdevlocal/iso';
import { ConditionsHourly } from './conditions-hourly';
import { weatherStatusDescription } from './weather-utility';

const ConditionsSummarySuccess: React.FC = () => {
	const { meta, weather, astro } = useBatchResponse().success!;


	const statusDescription = mapNumberEnumValue(WeatherStatusType, weatherStatusDescription, weather.current.status);
	const nextSunEvent = astro.sun.relativity.next;

	return (
		<>
			{/* <IconTitle iconRender={
					<WeatherStatusIcon isDay={weather.current.isDaytime} status={weather.current.status} />
				}>
			</IconTitle> */}
			It's {statusDescription.itIsShort} and {Math.round(weather.current.temp)}&deg;.
			<Block.Bat08 />
			<MediumBodyText>
				{nextSunEvent.isRise ? 'Sunrise' : 'Sundown'} is in {getDurationDescription(meta.referenceTime, nextSunEvent.time)}.
			</MediumBodyText>
			<ConditionsHourly />
		</>
	);
};


const ConditionsSummaryErrorLoad: React.FC = () => {
	const { error } = useBatchResponse();


	const title = (
		// <IconTitle
		// 	iconRender={<BaseWeatherIcon type='empty' />}
		// >
		// 	Conditions
		// </IconTitle>
		null
	);

	function wrap(render: JSX.Element) {
		return (
			<>{render}</>
		);
	}

	if (error) {
		return wrap(
			<TextContainer>
				{title}
				<Block.Bat08 />
				<ErrorGeneric />
			</TextContainer>
		);
	}

	return wrap(
		<RowContainer>
			<TextContainer>
				{title}
				<Block.Bat08 />
				<MediumBodyText>Loading...</MediumBodyText>
			</TextContainer>
		</RowContainer>
	);
};

const Wrapped = wrapForBatchLoad(ConditionsSummaryErrorLoad, ConditionsSummarySuccess);

export const ConditionsSummary: React.FC = () => {
	return (
		<Panel>
			<Wrapped />
		</Panel>
	);
};

const RowContainer = styled.div`
	display: flex;
	align-items: center;
`;

const TextContainer = styled.div`
	flex: 1;
`;

