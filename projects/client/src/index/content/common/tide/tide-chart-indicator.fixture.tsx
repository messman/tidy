import * as React from 'react';
import styled from 'styled-components';
import { CosmosFixture } from '@/test';
import { FixtureSetup } from '@/test/cosmos-fixture';
import { TideChartIndicator } from './tide-chart-indicator';

const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: .5rem;
`;

export default CosmosFixture.create(() => {

	const percents = [0, 1, 2, 3, 4, 5, 10, 15, 30, 40, 50, 60, 70, 85, 90, 95, 96, 97, 98, 99, 100];

	return (
		<Container>
			{percents.map((percent, i) => {
				return (
					<TideChartIndicator percent={percent / 100} isCurrent={i % 2 === 0} />
				);
			})}
		</Container>
	);
}, {
	setup: FixtureSetup.glass,
});