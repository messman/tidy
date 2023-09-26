import * as React from 'react';
import styled from 'styled-components';
import { useBatchResponseSuccess } from '@/index/core/data/data';
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

	const { now } = useBatchResponseSuccess();
	const { temp } = now.tide;

	const roundedTemp = Math.round(temp);

	return (
		<Panel title="Water Temp">
			<Container>
				<TempText>{roundedTemp}&deg;</TempText>
			</Container>
		</Panel>
	);
};