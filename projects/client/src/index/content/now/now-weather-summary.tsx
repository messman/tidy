import * as React from 'react';
import styled from 'styled-components';
import { useBatchResponseSuccess } from '@/index/core/data/data';
import { Panel, SpacePanelEdge } from '@/index/core/layout/layout-panel';
import { fontStyles } from '@/index/core/text/text-shared';
import { TimeDurationTextUnit } from '@/index/core/text/text-unit';
import { mapNumberEnumValue, WeatherPointHourly, WeatherStatusType, WithDaytime } from '@wbtdevlocal/iso';
import { WeatherIconDayNight } from '../common/weather/weather-icon';
import { capitalizeFirst, weatherStatusDescription } from '../common/weather/weather-utility';
import { NowWeatherSummaryHourly } from './now-weather-summary-hourly';

export const NowWeatherSummary: React.FC = () => {

	const { meta, now } = useBatchResponseSuccess();
	const { current, hourly, indicatorChangeHourlyId } = now.weather;

	let comingSoonWeatherRender: React.ReactNode = null;

	const firstHourlyChangedIndicator = React.useMemo<WithDaytime<WeatherPointHourly> | null>(() => {
		if (!indicatorChangeHourlyId) {
			return null;
		}
		const index = hourly.findIndex((hourly) => hourly.id === indicatorChangeHourlyId);
		return hourly[index] as WithDaytime<WeatherPointHourly>;
	}, [hourly, indicatorChangeHourlyId]);

	if (firstHourlyChangedIndicator) {
		const isComingUp = !!firstHourlyChangedIndicator && firstHourlyChangedIndicator.time.diff(meta.referenceTime, 'hours').hours < 4;

		if (isComingUp) {
			const statusDescription = mapNumberEnumValue(WeatherStatusType, weatherStatusDescription, firstHourlyChangedIndicator.status);

			comingSoonWeatherRender = (
				<BodyText>
					{capitalizeFirst(statusDescription.futureConditions)} conditions coming in <TimeDurationTextUnit startTime={meta.referenceTime} stopTime={firstHourlyChangedIndicator.time} isPrecise={false} />
				</BodyText>
			);
		}
	}

	return (
		<Panel title="Weather">
			<Container>
				<TextContainer>
					<IconContainer>
						<WeatherIconDayNight
							isDay={current.isDaytime}
							rain={null}
							status={current.status}
						/>
						<TitleText>
							{capitalizeFirst(mapNumberEnumValue(WeatherStatusType, weatherStatusDescription, current.status).nowItIs)}
						</TitleText>
					</IconContainer>
					{comingSoonWeatherRender}
				</TextContainer>
				<NowWeatherSummaryHourly />
			</Container>
		</Panel>
	);
};

const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: .5rem;
	padding: ${SpacePanelEdge.value} 0;
`;

const TextContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: .5rem;
	padding: 0 ${SpacePanelEdge.value};
`;

const IconContainer = styled.div`
	display: flex;
	align-items: center;
	gap: .5rem;
`;

const TitleText = styled.div`
	${fontStyles.text.mediumHeavy}
`;

const BodyText = styled.div`
	${fontStyles.text.mediumRegular}
`;