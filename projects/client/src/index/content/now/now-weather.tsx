import * as React from 'react';
import styled from 'styled-components';
import { SpacePanelGridGap } from '@/index/core/layout/layout-panel';
import { NowWeatherHumidity } from './now-weather-humidity';
import { NowWeatherSummary } from './now-weather-summary';
import { NowWeatherTempAir } from './now-weather-temp-air';
import { NowWeatherTempWater } from './now-weather-temp-water';
import { NowWeatherUV } from './now-weather-uv';
import { NowWeatherVisibility } from './now-weather-visibility';
import { NowWeatherWind } from './now-weather-wind';
import { Section } from './section';

const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${SpacePanelGridGap.value};
`;

const GridContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	place-items: stretch stretch;
	gap: ${SpacePanelGridGap.value};

	/* & > * {
		
		aspect-ratio: 1;
	} */
`;

export const NowWeather: React.FC = () => {
	return (
		<Section title="Conditions">
			<Container>
				<NowWeatherSummary />
				<GridContainer>
					<NowWeatherTempAir />
					<NowWeatherTempWater />
					<NowWeatherVisibility />
					<NowWeatherHumidity />
					<NowWeatherWind />
					<NowWeatherUV />
				</GridContainer>
			</Container>
		</Section>
	);
};