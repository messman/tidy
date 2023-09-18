import * as React from 'react';
import styled from 'styled-components';
import { Panel, SpacePanelEdge } from '@/index/core/layout/layout-panel';
import { fontStyles } from '@/index/core/text/text-shared';

const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: .5rem;
	padding: ${SpacePanelEdge.value};
`;

const TempText = styled.div`
	${fontStyles.stylized.statistic}
`;

export const NowWeatherTempWater: React.FC = () => {

	// const { , now, week } = useBatchResponseSuccess();
	// const { wate } = now.weather.current;

	// const roundedTemp = Math.round(temp);

	return (
		<Panel title="Water Temp">
			<Container>
				<TempText>99&deg;</TempText>
			</Container>
		</Panel>
	);
};