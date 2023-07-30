import styled, { css } from 'styled-components';
import { borderRadiusStyle, Spacing } from '@/core/primitive/primitive-design';
import { fontStyles } from '@/core/text';
import { themeTokens } from '@/core/theme';

export const Panel = styled.div`
	background-color: ${themeTokens.background.oneBox};
	${borderRadiusStyle};
	box-shadow: ${themeTokens.shadow.b_card};
`;

export const panelPaddingValue = Spacing.dog16;
export const panelPaddingStyle = css`
	padding: ${Spacing.dog16};
`;
export const PanelPadding = styled.div`
	${panelPaddingStyle};
`;

export const PanelTitle = styled.div`
	${fontStyles.headings.h4};
`;