import * as React from 'react';
import styled, { css } from 'styled-components';
import { borderRadiusValue, Spacing } from '@/index/core/primitive/primitive-design';
import { StyledFC } from '../primitive/primitive-styled';
import { fontStyles } from '../text/text-shared';
import { themeTokens } from '../theme/theme-root';
import { createSpaceHelper } from './layout-shared';

const buttonStyles = css`
	cursor: pointer;
`;

// Solution for blend mode not affecting children: https://stackoverflow.com/questions/31629541/remove-mix-blend-mode-from-child-element
const PanelBase_Container = styled.div<{ $isButton: boolean; $croppedTop: boolean; $croppedBottom: boolean; }>`
	width: 100%;
	/* Use CSS Grid in order to directly layer the content element over the container element. */
	display: grid;
	grid-template-areas: 'item';
	place-content: normal;

	${p => p.$isButton && buttonStyles};

	/* Have to put blended background into a pseudo-element to ensure the blending does not apply to children. */
	&::before {
		content: '';
		grid-area: item;
		border-top-right-radius: ${p => p.$croppedTop ? 0 : borderRadiusValue};
		border-top-left-radius: ${p => p.$croppedTop ? 0 : borderRadiusValue};
		border-bottom-right-radius: ${p => p.$croppedBottom ? 0 : borderRadiusValue};
		border-bottom-left-radius: ${p => p.$croppedBottom ? 0 : borderRadiusValue};
		background: ${themeTokens.background.glass.gradient};
		mix-blend-mode: ${themeTokens.background.glass.blendMode};
		backdrop-filter: blur(4px);
	}
`;

const PanelBase_Content = styled.div`
	grid-area: item;
	isolation: isolate;
	min-width: 0; // https://stackoverflow.com/a/43312314
`;

export const SpacePanelEdge = createSpaceHelper(Spacing.cat12);

export const SpacePanelGridGap = createSpaceHelper(Spacing.cat12);
export const SpacePanelGridPadding = createSpaceHelper(Spacing.cat12);
export const SpacePanelGridListPadding = createSpaceHelper(Spacing.dog16);

export const PanelPadding = styled.div`
	padding: ${SpacePanelEdge.value};
`;

export const PanelTitle = styled.div`
	${fontStyles.stylized.capitalized};
	color: ${themeTokens.text.subtle};
	padding: 0 ${SpacePanelEdge.value};
	padding-top: .5rem;
`;

export interface PanelProps {
	title?: string;
	croppedTop?: boolean;
	croppedBottom?: boolean;
	children: React.ReactNode;
	onClick?: () => void;
};

export const Panel: StyledFC<PanelProps> = (props) => {
	const { className, title, croppedBottom = false, croppedTop = false, onClick, children } = props;

	return (
		<PanelBase_Container onClick={onClick} $isButton={!!onClick} $croppedBottom={croppedBottom} $croppedTop={croppedTop}>
			<PanelBase_Content className={className}>
				{title && <PanelTitle>{title}</PanelTitle>}
				{children}
			</PanelBase_Content>
		</PanelBase_Container>
	);
};