import * as React from 'react';
import styled from 'styled-components';
import { MediumBodyText } from '@/core/text';
import { themeTokens } from '@/core/theme';
import { CosmosFixture } from '@/test';
import { fixtureDefault } from '@/test/cosmos-fixture';
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
			<MediumBodyText>{LayoutOrientation[windowLayout.orientation]}</MediumBodyText>
			<MediumBodyText>width - {LayoutBreakpointRem[windowLayout.widthBreakpoint]} ({windowLayout.widthBreakpoint})</MediumBodyText>
			<MediumBodyText>height - {LayoutBreakpointRem[windowLayout.heightBreakpoint]} ({windowLayout.heightBreakpoint})</MediumBodyText>
			{invalidText}
		</>
	);
}, {
	setup: fixtureDefault.docTwoPad
});

const InvalidText = styled(MediumBodyText)`
	color: ${themeTokens.inform.negative};
`;