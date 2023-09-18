import * as React from 'react';
import styled from 'styled-components';
import { useBatchResponseSuccess } from '@/index/core/data/data';
import { Panel, SpacePanelEdge } from '@/index/core/layout/layout-panel';
import { fontStyles } from '@/index/core/text/text-shared';
import { WeatherTempBar } from '../common/weather/weather-temp-bar';

const Container = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: .5rem;
	padding: ${SpacePanelEdge.value};
	justify-content: space-between;
`;

const TempsContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: .25rem;
`;

const RangeContainer = styled.div`
	display: flex;
	align-items: center;
	gap: .5rem;
`;

const TempText = styled.div`
	${fontStyles.stylized.statistic}
`;

const RangeText = styled.div`
	${fontStyles.text.medium}
`;

const DescriptionText = styled.div`
	${fontStyles.text.small}
`;

const WeatherTempBarStretch = styled(WeatherTempBar)`
	flex: 1;
`;

const FlexPanel = styled(Panel)`
	display: flex;
	flex-direction: column;
`;

export const NowWeatherTempAir: React.FC = () => {

	const { meta, now, week } = useBatchResponseSuccess();
	const { temp, tempFeelsLike } = now.weather.current;

	const { minTemp, maxTemp } = week.days.find((day) => {
		return day.day.hasSame(meta.referenceTime, 'day');
	})!.weather;

	const roundedTemp = Math.round(temp);
	const roundedLow = Math.round(minTemp);
	const roundedHigh = Math.round(maxTemp);
	const roundedFeelsLike = Math.round(tempFeelsLike);

	return (
		<FlexPanel title="Air Temp">
			<Container>
				<TempsContainer>
					<TempText>{roundedTemp}&deg;</TempText>
					<RangeContainer>
						<RangeText>{roundedLow}&deg;</RangeText>
						<WeatherTempBarStretch low={roundedLow} high={roundedHigh} value={roundedTemp} />
						<RangeText>{roundedHigh}&deg;</RangeText>
					</RangeContainer>
				</TempsContainer>
				{(roundedFeelsLike !== roundedTemp) && <DescriptionText>Feels like {roundedFeelsLike}&deg;.</DescriptionText>}
			</Container>
		</FlexPanel>
	);
};