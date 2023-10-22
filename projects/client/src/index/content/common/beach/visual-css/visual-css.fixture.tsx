import * as React from 'react';
import styled from 'styled-components';
import { useBatchResponseSuccess } from '@/index/core/data/data';
import { Button } from '@/index/core/form/button';
import { SpacePanelGridPadding } from '@/index/core/layout/layout-panel';
import { LayoutBreakpointRem } from '@/index/core/layout/window-layout';
import { MediumBodyText } from '@/index/core/text/text-shared';
import { CosmosFixture } from '@/test';
import { FixtureSetup } from '@/test/cosmos-fixture';
import { VisualCss } from './visual-css';

export default CosmosFixture.create(() => {

	const { now } = useBatchResponseSuccess();

	const [height, setHeight] = React.useState(now.tide.current.height);

	return (
		<CenteringContainer>
			<Container>
				<VisualCss waterLevelHeight={height} />
				<div>
					<MediumBodyText>{height.toString()}</MediumBodyText>
					<Button onClick={() => { setHeight(p => p - 1); }}>Minus 1</Button>
					<Button onClick={() => { setHeight(p => p + 1); }}>Plus 1</Button>
				</div>
			</Container>
		</CenteringContainer>
	);
}, {
	setup: FixtureSetup.root,
	isSuccessOnly: true
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