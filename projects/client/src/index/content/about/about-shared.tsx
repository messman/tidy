import styled from 'styled-components';
import { SpacePanelEdge } from '@/index/core/layout/layout-panel';
import { FontWeight } from '@/index/core/primitive/primitive-design';
import { fontStyles } from '@/index/core/text/text-shared';
import { themeTokens } from '@/index/core/theme/theme-root';

export const SectionContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1rem;
`;

export const SectionHeading = styled.div`
	${fontStyles.lead.large};
	color: ${themeTokens.text.onBackground};
`;

export const PanelParagraph = styled.div`
	${fontStyles.text.medium};
	font-weight: ${FontWeight.regular};
	padding: 0 ${SpacePanelEdge.value};
	margin: ${SpacePanelEdge.value} 0;
`;