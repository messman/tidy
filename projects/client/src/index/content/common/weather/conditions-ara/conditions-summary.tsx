import * as React from 'react';
import styled from 'styled-components';
import { ErrorGeneric } from '@/index/core/error/error-generic';
import { Block } from '@/index/core/layout/layout-shared';
import { Panel } from '@/index/core/layout/panel/panel';
import { wrapForBatchLoad } from '@/index/core/loader/batch-load-control';
import { MediumBodyText } from '@/index/core/text/text-shared';
import { weatherStatusDescription } from '@/services/content/weather-utility';
import { useBatchResponse } from '@/services/data/data';
import { getDurationDescription } from '@/services/time';
import * as iso from '@wbtdevlocal/iso';
import { ConditionsHourly } from './conditions-hourly';

const ConditionsSummarySuccess: React.FC = () => {
	const { meta, weather, astro } = useBatchResponse().success!;


	const statusDescription = iso.mapNumberEnumValue(iso.Weather.StatusType, weatherStatusDescription, weather.current.status);
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

