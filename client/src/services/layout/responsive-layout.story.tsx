import * as React from 'react';
import { decorate } from '@/test/storybook/decorate';
import { Subtitle } from '@/core/symbol/text';
import { styled } from '@/core/style/styled';
import { useResponsiveLayout, LayoutBreakpoint, LayoutMode, isInvalidLayoutForApplication } from './responsive-layout';

export default { title: 'services/layout' };

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