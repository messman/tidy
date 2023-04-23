import * as React from 'react';
import styled, { StyledComponent } from 'styled-components';
import { IconWrapper, IconWrapperProps } from '../icon/icon-wrapper';
import { ComponentSize } from '../primitive/primitive-design';
import { CssOutput, StyledFC } from '../primitive/primitive-styled';
import { ellipsisStyle } from '../text';
import { fontStyles } from './text-shared';

export const labelDeclarations: Record<ComponentSize, CssOutput> = {
	medium: fontStyles.text.mediumHeavy,
	small: fontStyles.text.smallHeavy,
};

export interface LabelTextProps {
}

/** A basic label element. Uses ellipses. */
export const MediumLabelText = styled.div`
	${labelDeclarations.medium};
	${ellipsisStyle}
`;

/** A basic label element. Uses ellipses. */
export const SmallLabelText = styled.div`
	${labelDeclarations.small};
	${ellipsisStyle}
`;

export const labelComponent: Record<ComponentSize, StyledComponent<'span', any, {}, never>> = {
	medium: MediumLabelText,
	small: SmallLabelText,
};

export interface IconLabelProps extends LabelTextProps, IconWrapperProps {
	size: ComponentSize;
	children: React.ReactNode;
}

export const IconLabel: StyledFC<IconLabelProps> = (props) => {
	const { leftIcon, rightIcon, size, children, justifyContent, className, ...otherProps } = props;

	const textRender = <>{children}</>;

	let iconRender: JSX.Element = textRender;

	if (leftIcon || rightIcon) {
		iconRender = (
			<IconWrapper size={size} leftIcon={leftIcon} rightIcon={rightIcon} justifyContent={justifyContent}>
				{children}
			</IconWrapper>
		);
	}

	const LabelComponent = labelComponent[size];

	return (
		<LabelComponent className={className} {...otherProps}>
			{iconRender}
		</LabelComponent>
	);
};