import * as React from 'react';
import { fontStyleDeclarations } from '@/core/text';
import { styled } from '@/core/theme/styled';
import { CosmosFixture } from '@/test';
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
}, {});

const Text = styled.div`
	${fontStyleDeclarations.body};
`;

const InvalidText = styled(Text)`
	color: ${p => p.theme.common.system.red.a_main};
`;