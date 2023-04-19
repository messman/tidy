import * as React from 'react';
import styled from 'styled-components';
import { Spacing } from '@/core/theme/box';
import { CosmosFixture } from '@/test';
import { FixtureContainer } from '@/test/cosmos-fixture';
import { Home } from './home';

export default CosmosFixture.create(() => {
	return (
		<Container>
			<Home />
		</Container>
	);
}, {
	container: FixtureContainer.none
});

const Container = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	padding: ${Spacing.cat12};
	overflow-y: auto;
`;