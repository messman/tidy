import { fontStyleDeclarations } from '@/core/text';
import { borderRadiusStyle, Spacing } from '@/core/theme/box';
import { css, styled } from '@/core/theme/styled';

export const Panel = styled.div`
	background-color: ${p => p.theme.gradient.cover};
	${borderRadiusStyle};
	box-shadow: ${p => p.theme.shadow.b_card};
`;

export const panelPaddingValue = Spacing.dog16;
export const panelPaddingStyle = css`
	padding: ${Spacing.dog16};
`;
export const PanelPadding = styled.div`
	${panelPaddingStyle};
`;

export const PanelTitle = styled.div`
	${fontStyleDeclarations.heading4};
`;