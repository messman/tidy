import * as React from 'react';
import styled from 'styled-components';
import { Spacing } from '@/core/primitive/primitive-design';
import { CosmosFixture } from '@/test';
import { fixtureDefault } from '@/test/cosmos-fixture';
import { Home } from './home';

export default CosmosFixture.create(() => {
	return (
		<Container>
			<Home />
		</Container>
	);
}, {
	setup: fixtureDefault.root
});

const Container = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	padding: ${Spacing.cat12};
	overflow-y: auto;
`;