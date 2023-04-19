import * as React from 'react';
import styled from 'styled-components';
import { fontStyleDeclarations } from '@/core/text';
import { CosmosFixture } from '@/test';
import { FixtureContainer } from '@/test/cosmos-fixture';
import { LayoutOrientation, useWindowMediaLayout } from '@messman/react-common';
import { isInvalidLayout, LayoutBreakpointRem } from './window-layout';

export default CosmosFixture.create(() => {

	const windowLayout = useWindowMediaLayout();
	let invalidText: JSX.Element | null = null;
	if (isInvalidLayout(windowLayout)) {
		invalidText = <InvalidText>Invalid Layout</InvalidText>;
	}

	return (
		<>
			<Text>{LayoutOrientation[windowLayout.orientation]}</Text>
			<Text>width - {LayoutBreakpointRem[windowLayout.widthBreakpoint]} ({windowLayout.widthBreakpoint})</Text>
			<Text>height - {LayoutBreakpointRem[windowLayout.heightBreakpoint]} ({windowLayout.heightBreakpoint})</Text>
			{invalidText}
		</>
	);
}, {
	container: FixtureContainer.panelPadding
});

const Text = styled.div`
	${fontStyleDeclarations.body};
`;

const InvalidText = styled(Text)`
	color: ${p => p.theme.common.system.red.a_main};
`;