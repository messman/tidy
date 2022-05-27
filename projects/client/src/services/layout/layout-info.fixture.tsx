import * as React from 'react';
import { styled } from '@/core/style/styled';
import { Subtitle } from '@/core/symbol/text';
import { CosmosFixture } from '@/test';
import { DefaultLayoutBreakpoint, LayoutOrientation, useWindowMediaLayout } from '@messman/react-common';

export default CosmosFixture.create(() => {
	const windowLayout = useWindowMediaLayout();
	let invalidSubtitle: JSX.Element | null = null;
	if (windowLayout.heightBreakpoint < DefaultLayoutBreakpoint.regular) {
		invalidSubtitle = <InvalidSubtitle>Invalid Layout</InvalidSubtitle>;
	}

	return (
		<>
			<Subtitle>{LayoutOrientation[windowLayout.orientation]}</Subtitle>
			<Subtitle>width - {DefaultLayoutBreakpoint[windowLayout.widthBreakpoint]} ({windowLayout.widthBreakpoint})</Subtitle>
			<Subtitle>height - {DefaultLayoutBreakpoint[windowLayout.heightBreakpoint]} ({windowLayout.heightBreakpoint})</Subtitle>
			{invalidSubtitle}
		</>
	);
}, {
	hasMargin: true
});

const InvalidSubtitle = styled(Subtitle)`
	color: ${p => p.theme.color.warning};
`;