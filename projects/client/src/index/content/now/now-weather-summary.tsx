import * as React from 'react';
import styled from 'styled-components';
import { useBatchResponseSuccess } from '@/index/core/data/data';
import { Panel, SpacePanelEdge } from '@/index/core/layout/layout-panel';
import { fontStyles } from '@/index/core/text/text-shared';
import { mapNumberEnumValue, WeatherStatusType } from '@wbtdevlocal/iso';
import { WeatherIconDayNight } from '../common/weather/weather-icon';
import { weatherStatusDescription } from '../common/weather/weather-utility';
import { NowWeatherSummaryHourly } from './now-weather-summary-hourly';

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

export const NowWeatherSummary: React.FC = () => {

	const { now } = useBatchResponseSuccess();
	const { current } = now.weather;

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
							It's {mapNumberEnumValue(WeatherStatusType, weatherStatusDescription, current.status).itIsShort}
						</TitleText>
					</IconContainer>
				</TextContainer>
				<NowWeatherSummaryHourly />
			</Container>
		</Panel>
	);
};