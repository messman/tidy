import * as React from 'react';
import styled, { StyledComponent } from 'styled-components';
import { Block } from '../layout/layout-shared';
import { ComponentSize } from '../primitive/primitive-design';
import { StyledFC } from '../primitive/primitive-styled';
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
	children: React.ReactNode;
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