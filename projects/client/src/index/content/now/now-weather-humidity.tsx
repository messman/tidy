import * as React from 'react';
import styled from 'styled-components';
import { useBatchResponseSuccess } from '@/index/core/data/data';
import { Panel, SpacePanelEdge } from '@/index/core/layout/layout-panel';
import { fontStyles } from '@/index/core/text/text-shared';

const Container = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: .5rem;
	padding: ${SpacePanelEdge.value};
	justify-content: space-between;
`;

const TextContainer = styled.div`
	display: flex;
	flex-direction: column;
`;

const StatisticText = styled.div`
	${fontStyles.stylized.statistic}
`;

const DescriptionText = styled.div`
	${fontStyles.text.small}
`;

const FlexPanel = styled(Panel)`
	display: flex;
	flex-direction: column;
`;

export const NowWeatherHumidity: React.FC = () => {

	const { now } = useBatchResponseSuccess();
	const { humidity, dewPoint } = now.weather.current;

	const humidityRounded = Math.round(humidity * 100);
	const dewPointRounded = Math.round(dewPoint);

	/*
		Sources:
		- https://www.weather.gov/arx/heat_index
		- https://weatherworksinc.com/news/humidity-vs-dewpoint
	*/
	const isMuggy = dewPointRounded >= 65;
	const muggyText = isMuggy ? ', indicating muggy conditions' : '';

	return (
		<FlexPanel title="Humidity">
			<Container>
				<TextContainer>
					<StatisticText>{humidityRounded}%</StatisticText>
				</TextContainer>
				<DescriptionText>
					The dew point is {dewPointRounded}&deg;{muggyText}.
				</DescriptionText>
			</Container>
		</FlexPanel>
	);
};