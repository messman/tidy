import * as React from 'react';
import { fontStyleDeclarations } from '../text';
import { Block } from '../theme/box';
import { css, styled } from '../theme/styled';

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
 * The top-level HTML element under the root.
 * Also used in the testing layout.
 * flex direction: column.
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