import * as React from 'react';
import styled from 'styled-components';
import { SpacePanelGridPadding } from '@/index/core/layout/layout-panel';
import { LayoutBreakpointRem } from '@/index/core/layout/window-layout';
import { Cosmos, CosmosFixture } from '@/test';
import { FixtureSetup } from '@/test/cosmos-fixture';
import { VisualCss } from './visual-css';

export default CosmosFixture.create(() => {

	const height = Cosmos.useControlValue("Height", 5);

	return (
		<CenteringContainer>
			<Container>
				<VisualCss waterLevelHeight={height} />
			</Container>
		</CenteringContainer>
	);
}, {
	setup: FixtureSetup.root
});


const CenteringContainer = styled.div`
	display: flex;
	justify-content: center;
	
`;

const Container = styled.div`
	width: 100%;
	max-width: ${LayoutBreakpointRem.e50}rem;
	padding: ${SpacePanelGridPadding.value};
`;