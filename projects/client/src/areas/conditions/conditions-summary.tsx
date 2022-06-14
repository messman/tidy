import * as React from 'react';
import { ErrorGeneric } from '@/core/error/error-generic';
import { SpinnerIcon } from '@/core/icon/icon-spinner';
import { AppScreen, useAppNavigation } from '@/core/layout/app/app-navigation';
import { IconTitle, Line } from '@/core/layout/layout';
import { Panel } from '@/core/layout/panel/panel';
import { wrapForBatchLoad } from '@/core/loader/batch-load-control';
import { Paragraph } from '@/core/text';
import { Block } from '@/core/theme/box';
import { styled } from '@/core/theme/styled';
import { BaseWeatherIcon, WeatherStatusIcon } from '@/core/weather/weather-icon';
import { weatherStatusDescription } from '@/services/content/weather-utility';
import { useBatchResponse } from '@/services/data/data';
import { getDurationDescription } from '@/services/time';
import * as iso from '@wbtdevlocal/iso';
import { HomeSummaryClickPadding, HomeSummarySpinnerIcon } from '../home/home-summary-shared';
import { ConditionsHourly } from './conditions-hourly';

const ConditionsSummarySuccess: React.FC = () => {
	const { meta, weather, astro } = useBatchResponse().success!;
	const { setScreen } = useAppNavigation();

	function onClick() {
		setScreen(AppScreen.d_conditions);
	}

	const statusDescription = iso.mapEnumValue(iso.Weather.StatusType, weatherStatusDescription, weather.current.status);
	const nextSunEvent = astro.sun.relativity.next;

	return (
		<>
			<HomeSummaryClickPadding onClick={onClick} isConnectedBelow={true}>
				<IconTitle iconRender={
					<WeatherStatusIcon isDay={weather.current.isDaytime} status={weather.current.status} />
				}>
					It's {statusDescription.itIsShort} and {Math.round(weather.current.temp)}&deg;.
				</IconTitle>
				<Block.Bat08 />
				<Paragraph>
					{nextSunEvent.isRise ? 'Sunrise' : 'Sundown'} is in {getDurationDescription(meta.referenceTime, nextSunEvent.time)}.
				</Paragraph>
			</HomeSummaryClickPadding>
			<Line />
			<ConditionsHourly />
		</>
	);
};


const ConditionsSummaryErrorLoad: React.FC = () => {
	const { error } = useBatchResponse();
	const { setScreen } = useAppNavigation();

	function onClick() {
		setScreen(AppScreen.d_conditions);
	}

	const title = (
		<IconTitle
			iconRender={<BaseWeatherIcon type='empty' />}
		>
			Conditions
		</IconTitle>
	);

	function wrap(render: JSX.Element) {
		return (
			<HomeSummaryClickPadding onClick={onClick}>
				{render}
			</HomeSummaryClickPadding>
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
				<Paragraph>Loading...</Paragraph>
			</TextContainer>
			<HomeSummarySpinnerIcon type={SpinnerIcon} />
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

