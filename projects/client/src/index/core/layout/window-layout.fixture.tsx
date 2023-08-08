import * as React from 'react';
import styled from 'styled-components';
import { MediumBodyText } from '@/index/core/text/text-shared';
import { themeTokens } from '@/index/core/theme/theme-root';
import { CosmosFixture } from '@/test';
import { FixtureSetup } from '@/test/cosmos-fixture';
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
	setup: FixtureSetup.glass
});

const InvalidText = styled(MediumBodyText)`
	color: ${themeTokens.inform.unsure};
`;