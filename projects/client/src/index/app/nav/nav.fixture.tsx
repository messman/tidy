import * as React from 'react';
import styled from 'styled-components';
import { MediumBodyText } from '@/index/core/text/text-shared';
import { CosmosFixture } from '@/test';
import { FixtureSetup } from '@/test/cosmos-fixture';
import { Nav } from './nav';
import { useNav } from './nav-context';

export default CosmosFixture.create(() => {

	const { selectedTab } = useNav();

	return (
		<Container >
			<MediumBodyText>{selectedTab}</MediumBodyText>
			<Nav isLower={false} />
			<Nav isLower={true} />
		</Container>
	);
}, {
	setup: FixtureSetup.root
});

const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1rem;
`;
