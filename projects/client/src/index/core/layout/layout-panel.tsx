import * as React from 'react';
import styled, { css } from 'styled-components';
import { borderRadiusStyle, Spacing } from '@/index/core/primitive/primitive-design';
import { fontStyles } from '../text/text-shared';
import { themeTokens } from '../theme/theme-root';
import { createSpaceHelper } from './layout-shared';

const panelStyles = css`
	background: ${themeTokens.background.glass.gradient};
	mix-blend-mode: ${themeTokens.background.glass.blendMode};
	${borderRadiusStyle};
	backdrop-filter: blur(4px);
`;

export const panelSpace = createSpaceHelper(Spacing.cat12);

export const PanelPadded = styled.div`
	${panelStyles}
	padding: ${panelSpace.value};
	width: 100%;
`;


const PanelTitled_Panel = styled.div`
	${panelStyles}
`;

const PanelTitled_Title = styled.div`
	${fontStyles.stylized.capitalized};
	color: ${themeTokens.text.subtle};
	padding: ${panelSpace.value};
	padding-top: .5rem;
`;

export interface PanelTitledProps {
	title: string;
	children: React.ReactNode;
}

export const PanelTitled: React.FC<PanelTitledProps> = (props) => {
	const { title, children } = props;

	return (
		<PanelTitled_Panel>
			<PanelTitled_Title>{title}</PanelTitled_Title>
			{children}
		</PanelTitled_Panel>
	);
}


