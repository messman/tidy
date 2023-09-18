import * as React from 'react';
import styled from 'styled-components';
import { CosmosFixture } from '@/test';
import { FixtureSetup } from '@/test/cosmos-fixture';
import { WeatherUVBar } from './weather-uv-bar';

const Container = styled.div`
	display: flex;
	gap: .5rem;
`;

export default CosmosFixture.create(() => {

	const values: number[] = [];
	for (let i = 0; i <= 11; i++) {
		values.push(i);
	}

	return (
		<Container>
			{values.map((value) => {
				return (
					<WeatherUVBar
						key={value}
						value={value}
					/>
				);
			})}
		</Container>
	);
}, {
	setup: FixtureSetup.glass,
});