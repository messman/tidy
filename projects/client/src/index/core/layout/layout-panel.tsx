import * as React from 'react';
import styled, { css } from 'styled-components';
import { borderRadiusValue, Spacing } from '@/index/core/primitive/primitive-design';
import { StyledFC } from '../primitive/primitive-styled';
import { fontStyles } from '../text/text-shared';
import { themeTokens } from '../theme/theme-root';
import { backgroundGlassStyle, createSpaceHelper } from './layout-shared';

const buttonStyles = css`
	cursor: pointer;
`;

// Solution for blend mode not affecting children: https://stackoverflow.com/questions/31629541/remove-mix-blend-mode-from-child-element
const Panel_Container = styled.div<{ $isButton: boolean; $croppedTop: boolean; $croppedBottom: boolean; }>`
	position: relative;
	width: 100%;
	border-top-right-radius: ${p => p.$croppedTop ? 0 : borderRadiusValue};
	border-top-left-radius: ${p => p.$croppedTop ? 0 : borderRadiusValue};
	border-bottom-right-radius: ${p => p.$croppedBottom ? 0 : borderRadiusValue};
	border-bottom-left-radius: ${p => p.$croppedBottom ? 0 : borderRadiusValue};

	${p => p.$isButton && buttonStyles};

	${backgroundGlassStyle}
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
		<Panel_Container className={className} onClick={onClick} $isButton={!!onClick} $croppedBottom={croppedBottom} $croppedTop={croppedTop}>
			{title && <PanelTitle>{title}</PanelTitle>}
			{children}
		</Panel_Container>
	);
};