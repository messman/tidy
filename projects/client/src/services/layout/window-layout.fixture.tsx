import * as React from 'react';
import { Subtitle } from '@/core/text';
import { styled } from '@/core/theme/styled';
import { CosmosFixture } from '@/test';
import { DefaultLayoutBreakpoint, LayoutOrientation, useWindowMediaLayout } from '@messman/react-common';
import { isInvalidLayout } from './window-layout';

export default CosmosFixture.create(() => {

	const windowLayout = useWindowMediaLayout();
	let invalidText: JSX.Element | null = null;
	if (isInvalidLayout(windowLayout)) {
		invalidText = <InvalidText>Invalid Layout</InvalidText>;
	}

	return (
		<>
			<Subtitle>{LayoutOrientation[windowLayout.orientation]}</Subtitle>
			<Subtitle>width - {DefaultLayoutBreakpoint[windowLayout.widthBreakpoint]} ({windowLayout.widthBreakpoint})</Subtitle>
			<Subtitle>height - {DefaultLayoutBreakpoint[windowLayout.heightBreakpoint]} ({windowLayout.heightBreakpoint})</Subtitle>
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