import * as React from 'react';
import styled from 'styled-components';
import { useBatchResponseSuccess } from '@/index/core/data/data';
import { Panel, SpacePanelEdge } from '@/index/core/layout/layout-panel';
import { fontStyles } from '@/index/core/text/text-shared';
import { WeatherUVBar } from '../common/weather/weather-uv-bar';

const Container = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: .75rem;
	padding: ${SpacePanelEdge.value};
	justify-content: space-between;
`;

const BarContainer = styled.div`
	display: flex;
	gap: 1rem;
`;

const BarTextContainer = styled.div`
	display: flex;
	flex-direction: column;
`;

const StatisticText = styled.div`
	${fontStyles.stylized.statistic}
`;

const TitleText = styled.div`
	${fontStyles.text.medium}
`;

const DescriptionText = styled.div`
	${fontStyles.text.small};
`;

const FlexPanel = styled(Panel)`
	display: flex;
	flex-direction: column;
`;

// https://www.epa.gov/sunsafety/uv-index-scale-0
function getUVDescription(value: number): string {
	if (value < 3) {
		return 'Minimal sun protection needed.';
	}
	if (value < 6) {
		return 'Use sun protection during peak sun.';
	}
	if (value < 8) {
		return 'Use sun protection and seek shade.';
	}
	return 'Danger - use sun protection!';
}

const uviToTitle = {
	0: 'None',
	1: 'Low',
	2: 'Low',
	3: 'Moderate',
	4: 'Moderate',
	5: 'Moderate',
	6: 'High',
	7: 'High',
	8: 'Very High',
	9: 'Very High',
	10: 'Very High',
	11: 'Extreme',
};


export const NowWeatherUV: React.FC = () => {

	const { now } = useBatchResponseSuccess();
	const { uvi } = now.weather.current;

	const normValue = Math.max(0, Math.min(11, Math.round(uvi)));
	// Technically it could be above 11.
	const isAbove11 = uvi > 11;

	const title = uviToTitle[normValue as keyof typeof uviToTitle];
	const description = getUVDescription(normValue);

	return (
		<FlexPanel title="UV Index">
			<Container>
				<BarContainer>
					<WeatherUVBar value={normValue} />
					<BarTextContainer>
						<StatisticText>{normValue.toString()}{isAbove11 ? '+' : ''}</StatisticText>
						<TitleText>{title}</TitleText>
					</BarTextContainer>
				</BarContainer>
				<DescriptionText>{description}</DescriptionText>
			</Container>
		</FlexPanel>
	);
};