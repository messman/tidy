import * as React from 'react';
import styled, { css } from 'styled-components';
import { fontStyleDeclarations } from '../text';
import { Block } from '../theme/box';
import { StyledForwardRef } from '../theme/styled';

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

export interface IconTitleProps {
	iconRender: JSX.Element;
	children: React.ReactNode;
}

export const IconTitle: React.FC<IconTitleProps> = (props) => {
	const { iconRender, children } = props;
	return (
		<TitleContainer>
			{iconRender}
			<Block.Bat08 />
			<TitleText>
				{children}
			</TitleText>
		</TitleContainer>
	);
};

const TitleContainer = styled.div`
	display: flex;
	align-items: center;
`;

const TitleText = styled.div`
	${fontStyleDeclarations.heading5};
`;

export const Line = styled.div`
	width: 100%;
	height: 1px;
	background-color: ${p => p.theme.outlineDistinct};
`;