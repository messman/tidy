import * as React from 'react';
import styled from 'styled-components';
import { borderRadiusStyle, Spacing } from '@/index/core/primitive/primitive-design';
import { StyledFC } from '../primitive/primitive-styled';
import { fontStyles } from '../text/text-shared';
import { themeTokens } from '../theme/theme-root';
import { createSpaceHelper } from './layout-shared';

// Solution for blend mode not affecting children: https://stackoverflow.com/questions/31629541/remove-mix-blend-mode-from-child-element
const PanelBase_Container = styled.div`
	width: 100%;
	/* Use CSS Grid in order to directly layer the content element over the container element. */
	display: grid;
	grid-template-areas: 'item';
	place-content: end stretch;
	${borderRadiusStyle};

	/* Have to put blended background into a pseudo-element to ensure the blending does not apply to children. */
	&::before {
		content: '';
		grid-area: item;
		${borderRadiusStyle};
		background: ${themeTokens.background.glass.gradient};
		mix-blend-mode: ${themeTokens.background.glass.blendMode};
		backdrop-filter: blur(4px);
	}
`;

const PanelBase_Content = styled.div`
	grid-area: item;
	isolation: isolate;
`;


type PanelBaseProps = {
	children: React.ReactNode;
};

const PanelBase_Unstyled: StyledFC<PanelBaseProps> = (props) => {
	const { className, children } = props;

	return (
		<PanelBase_Container>
			<PanelBase_Content className={className}>
				{children}
			</PanelBase_Content>
		</PanelBase_Container>
	);
};

export const SpacePanelEdge = createSpaceHelper(Spacing.cat12);

export const SpacePanelGridGap = createSpaceHelper(Spacing.cat12);
export const SpacePanelGridPadding = createSpaceHelper(Spacing.cat12);
export const SpacePanelGridListPadding = createSpaceHelper(Spacing.dog16);

export const PanelPadded = styled(PanelBase_Unstyled)`
	padding: ${SpacePanelEdge.value};
`;

const PanelTitled_Title = styled.div`
	${fontStyles.stylized.capitalized};
	color: ${themeTokens.text.subtle};
	padding: 0 ${SpacePanelEdge.value};
	padding-top: .5rem;
`;

export interface PanelTitledProps {
	title: string;
	children: React.ReactNode;
}

export const PanelTitled: React.FC<PanelTitledProps> = (props) => {
	const { title, children } = props;

	return (
		<PanelBase_Unstyled>
			<PanelTitled_Title>{title}</PanelTitled_Title>
			{children}
		</PanelBase_Unstyled>
	);
}


