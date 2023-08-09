import * as React from 'react';
import styled, { css } from 'styled-components';
import { Spacing } from '../primitive/primitive-design';
import { StyledForwardRef } from '../primitive/primitive-styled';
import { themeTokens } from '../theme/theme-root';

function createPadding(padding: string) {
	return styled.div`
		padding: ${padding};
	`;
}

export const Padding = {
	Ant04: createPadding(Spacing.ant04),
	Bat08: createPadding(Spacing.bat08),
	Cat12: createPadding(Spacing.cat12),
	Dog16: createPadding(Spacing.dog16),
	Elf24: createPadding(Spacing.elf24),
	Fan32: createPadding(Spacing.fan32),
	Guy40: createPadding(Spacing.guy40),
	Hut56: createPadding(Spacing.hut56),
	Inn64: createPadding(Spacing.inn64),
};

export function createBlock(spacing: string) {
	return styled.div`
		width: ${spacing};
		height: ${spacing};
		flex-shrink: 0;
	`;
}

export const Block = {
	Ant04: createBlock(Spacing.ant04),
	Bat08: createBlock(Spacing.bat08),
	Cat12: createBlock(Spacing.cat12),
	Dog16: createBlock(Spacing.dog16),
	Elf24: createBlock(Spacing.elf24),
	Fan32: createBlock(Spacing.fan32),
	Guy40: createBlock(Spacing.guy40),
	Hut56: createBlock(Spacing.hut56),
	Inn64: createBlock(Spacing.inn64),
};

export const Space = {

	/** Grid layout */
	//Grid: createSpaceHelper(Spacing.cat12),

	// /** Edges of screens or containers. */
	// Edge: createSpaceHelper(Spacing.cat12),
	// /** Edges of screens or containers when text is against those edges. */
	// EdgeClose: createSpaceHelper(Spacing.bat08),
	// /** Vertically stacked content where some amount of space already exists inside the components - button space, text line height, etc. */
	// ColMin: createSpaceHelper(Spacing.ant04),
	// /** Vertically stacked, closely-related content. */
	// ColClose: createSpaceHelper(Spacing.bat08),
	// /** Normal vertical content Column. */
	// Col: createSpaceHelper(Spacing.dog16),
	// /** Horizontal alignment where some amount of space already exists inside the components - button space, text line height, etc. */
	// RowMin: createSpaceHelper(Spacing.bat08),
	// /** Horizontal alignment, closely related. */
	// RowClose: createSpaceHelper(Spacing.cat12),
	// /** Horizontal alignment. */
	// Row: createSpaceHelper(Spacing.dog16),
	// /** Before/after sections. */
	// Section: createSpaceHelper(Spacing.fan32),
	// /** Before/after topics. */
	// Topic: createSpaceHelper(Spacing.guy40),
};

export function createSpaceHelper(spacing: string) {
	return {
		PadA: styled.div` padding: ${spacing};`,
		PadV: styled.div` padding: ${spacing} 0;`,
		PadH: styled.div` padding: 0 ${spacing}; `,
		Block: createBlock(spacing),
		value: spacing
	};
}


/*
	For the "focus ring":
	https://levelup.gitconnected.com/improve-accessibility-with-focus-focus-visible-outline-styling-24468e5295d0
*/

export const outlineAccessibilityStyle = css`
	:focus:not(:focus-visible) {
		outline: none;
	}
	:focus-visible {
		outline: 2px dashed ${themeTokens.outline.accessibility};
		/* outline-offset: .25rem; */
	}
`;

/**
 * Essentially, when computing how large a scrollable container should be,
 * the browser cannot be sure whether to use height from parent or children.
 * If all ancestors have 'overflow: hidden', the 'overflow: auto' scrollable
 * container will be scrollable.
 */
export const overflowHiddenScrollStyle = css`
	overflow: hidden;
`;

/**
 * Our default container: flex, row, stretch on both axes.
*/
export const flexDisplayStretchStyle = css`
	display: flex;
	flex-direction: row;
	justify-content: stretch;
	align-items: stretch;
`;

/**
 * An absolute container: 100% width and height.
*/
export const absolutePositionFullStyle = css`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
`;

/**
 * Handles a common case where a component is needed to transition from flex to
 * regular block styling so that children elements will take full width by default.
*/
export const FlexToBlock = styled.div`
	flex: 1;
	position: relative;
	display: block;
	${overflowHiddenScrollStyle}
`;

/**
 * Handles a common case where a component is needed for two things:
 * - Taking up the space of a parent that was display: flex
 * - Creating a relative-positioning parent for absolute children
*/
export const FlexToParentOfAbsolute = styled.div`
	flex: 1;
	position: relative;
	${overflowHiddenScrollStyle}
`;

/**
 * Handles a common case where a component is needed for two things:
 * - Taking up a relative parent as an absolute child
 * - Creating a flex parent for flex children
 * 
 * This may not get used often, as you'll likely want to change the styles within
 * for transitions. But it's here as an example.
*/
export const AbsoluteToFlexContainer = React.forwardRef((props, ref) => {
	return (
		<AbsoluteToFlex className={props.className} ref={ref}>
			<FlexToRelativeFlex>
				{props.children}
			</FlexToRelativeFlex>
		</AbsoluteToFlex>
	);
}) as StyledForwardRef<HTMLDivElement, React.PropsWithChildren>;

const AbsoluteToFlex = styled.div`
	${absolutePositionFullStyle}
	${flexDisplayStretchStyle}
	${overflowHiddenScrollStyle}
`;

const FlexToRelativeFlex = styled.div`
	flex: 1;
	${flexDisplayStretchStyle}
	position: relative;
	${overflowHiddenScrollStyle}
`;

/**
 * The top-level HTML element under the root.
 * Also used in the testing layout.
 */
export const ApplicationLayoutContainer = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	flex: 1;
	position: relative;
	width: 100%;
	height: 100%;
	${overflowHiddenScrollStyle};
`;