import styled, { css } from 'styled-components';
import { borderRadiusStyle, Spacing } from '@/index/core/primitive/primitive-design';
import { fontStyles } from '../../text/text-shared';
import { themeTokens } from '../../theme/theme-root';

export const Panel = styled.div`
	background-color: ${themeTokens.background.glass};
	${borderRadiusStyle};
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