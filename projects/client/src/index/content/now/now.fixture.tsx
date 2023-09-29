import * as React from 'react';
import styled from 'styled-components';
import { SpacePanelGridPadding } from '@/index/core/layout/layout-panel';
import { CosmosFixture } from '@/test';
import { FixtureSetup } from '@/test/cosmos-fixture';
import { Now } from './now';

const Container = styled.div`
	padding: ${SpacePanelGridPadding.value};
	overflow: auto;
`;

export default CosmosFixture.create(() => {
	return (
		<Container>
			<Now />
		</Container>
	);
}, {
	setup: FixtureSetup.root,
	isSuccessOnly: true
});