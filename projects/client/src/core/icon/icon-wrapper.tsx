import * as React from 'react';
import { StyledComponent } from 'styled-components';
import { Block } from '../theme/box';
import { ComponentSize } from '../theme/font';
import { styled, StyledFC } from '../theme/styled';
import { IconInputType, SizedIcon } from './icon';

const iconWrapperSpacingSize: Record<ComponentSize, StyledComponent<any, any, any, any>> = {
	medium: Block.Bat08,
	small: Block.Ant04,
};

export type FlexJustifyContent = 'flex-start' | 'center' | 'space-between' | 'space-around' | 'flex-end';

export interface IconWrapperProps {
	leftIcon?: IconInputType;
	rightIcon?: IconInputType;
	/** Default: flex-start. Other possibilities: center, space-between, space-around, flex-end */
	justifyContent?: FlexJustifyContent;
	size: ComponentSize;
}

export const IconWrapper: StyledFC<IconWrapperProps> = (props) => {
	const { leftIcon, rightIcon, size, children, justifyContent, className } = props;

	const Spacing = iconWrapperSpacingSize[size];
	const leftIconRender = leftIcon ? (
		<>
			<SizedIcon type={leftIcon} size={size} />
			<Spacing />
		</>
	) : null;
	const rightIconRender = rightIcon ? (
		<>
			<Spacing />
			<SizedIcon type={rightIcon} size={size} />
		</>
	) : null;
	return (
		<IconWrapperContainer className={className} $justifyContent={justifyContent}>
			{leftIconRender}
			{children}
			{rightIconRender}
		</IconWrapperContainer>
	);
};

const IconWrapperContainer = styled.div<{ $justifyContent?: FlexJustifyContent; }>`
	position: relative;
	display: flex;
	align-items: center;
	justify-content: ${p => p.$justifyContent || 'flex-start'};
`;