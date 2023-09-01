import * as React from 'react';
import styled from 'styled-components';
import { useBatchResponseSuccess } from '@/index/core/data/data';
import { SpacePanelGridPadding } from '@/index/core/layout/layout-panel';
import { Cosmos, CosmosFixture } from '@/test';
import { FixtureSetup } from '@/test/cosmos-fixture';
import { WeekDay } from './week-day';

const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: .5rem;
	padding: ${SpacePanelGridPadding.value};
	overflow: auto;
`;

export default CosmosFixture.create(() => {

	const { week } = useBatchResponseSuccess();

	const isShowingWeather = Cosmos.useControlValue("Weather", true);
	const isShowingBeach = Cosmos.useControlValue("Beach", true);
	const isShowingTide = Cosmos.useControlValue("Tide", true);

	return (
		<Container>
			<WeekDay
				day={week.days[0]}
				isShowingWeather={isShowingWeather}
				isShowingBeach={isShowingBeach}
				isShowingTide={isShowingTide}
			/>
			<WeekDay
				day={week.days[1]}
				isShowingWeather={isShowingWeather}
				isShowingBeach={isShowingBeach}
				isShowingTide={isShowingTide}
			/>
		</Container>
	);
}, {
	setup: FixtureSetup.root,
	isSuccessOnly: true
});