import * as React from 'react';
import styled from 'styled-components';
import { Cosmos, CosmosFixture } from '@/test';
import { FixtureSetup } from '@/test/cosmos-fixture';
import { WeatherTempBar } from './weather-temp-bar';

const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: .5rem;
`;

export default CosmosFixture.create(() => {

	const min = Cosmos.useControlValue('Min', 70);
	const low = Cosmos.useControlValue('Low', 74);
	const value = Cosmos.useControlValue('Value', 87);
	const high = Cosmos.useControlValue('High', 88);
	const max = Cosmos.useControlValue('Max', 100);

	const ranges: [number, number][] = [];
	for (let i = 0; i < 5; i++) {
		ranges.push([low + (i * 2), high + (i * 2)]);
	}

	return (
		<Container>
			{ranges.map((range, i) => {
				const [low, high] = range;
				return (
					<WeatherTempBar
						key={`${low}-${high}-${i}`}
						low={low}
						high={high}
						value={value}
						min={min}
						max={max}
					/>
				);
			})}
		</Container>
	);
}, {
	setup: FixtureSetup.glass,
});