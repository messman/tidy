import * as React from 'react';
import { decorate } from '@/test/storybook/decorate';
import { Subtitle } from '@/core/symbol/text';
import { styled } from '@/core/style/styled';
import { useResponsiveLayout, LayoutBreakpoint, LayoutMode, isInvalidLayoutForApplication } from './responsive-layout';

export default { title: 'services/layout' };

export const TestResponsive = decorate(() => {

	const responsiveLayout = useResponsiveLayout();
	let invalidSubtitle: JSX.Element | null = null;
	if (isInvalidLayoutForApplication(responsiveLayout)) {
		invalidSubtitle = <InvalidSubtitle>Invalid Layout</InvalidSubtitle>;
	}

	return (
		<>
			<Subtitle>{LayoutMode[responsiveLayout.mode]}</Subtitle>
			<Subtitle>width - {LayoutBreakpoint[responsiveLayout.widthBreakpoint]} ({responsiveLayout.widthBreakpoint})</Subtitle>
			<Subtitle>height - {LayoutBreakpoint[responsiveLayout.heightBreakpoint]} ({responsiveLayout.heightBreakpoint})</Subtitle>
			{invalidSubtitle}
		</>
	);
});


const InvalidSubtitle = styled(Subtitle)`
	color: ${p => p.theme.color.warning};
`;