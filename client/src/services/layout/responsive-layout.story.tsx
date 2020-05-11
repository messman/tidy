import * as React from 'react';
import { decorate } from '@/storybook/decorate';
import { Subtitle } from '@/styles/common';
import { useResponsiveLayout, LayoutBreakpoint, LayoutMode, isInvalidLayoutForApplication } from './responsive-layout';
import { styled } from '@/styles/styled';

export default { title: 'Tree/Layout/Responsive' };

export const Responsive = decorate(() => {

	const layout = useResponsiveLayout();
	let invalidSubtitle: JSX.Element | null = null;
	if (isInvalidLayoutForApplication(layout)) {
		invalidSubtitle = <InvalidSubtitle>Invalid Layout</InvalidSubtitle>
	}

	return (
		<>
			<Subtitle>{LayoutMode[layout.mode]}</Subtitle>
			<Subtitle>width - {LayoutBreakpoint[layout.widthBreakpoint]} ({layout.widthBreakpoint})</Subtitle>
			<Subtitle>height - {LayoutBreakpoint[layout.heightBreakpoint]} ({layout.heightBreakpoint})</Subtitle>
			{invalidSubtitle}
		</>
	);
});


const InvalidSubtitle = styled(Subtitle)`
	color: ${p => p.theme.color.warning};
`;