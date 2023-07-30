// import * as React from 'react';
// import styled from 'styled-components';
// import { IconWrapper, IconWrapperProps } from './icon/icon-wrapper';
// import { fontStyleDeclarations } from './text';
// import { ComponentSize, FontWeight } from './theme/font';
// import { CssOutput, StyledFC } from './theme/styled';

// export const labelSizeStyles: Record<ComponentSize, CssOutput> = {
// 	medium: fontStyleDeclarations.body,
// 	small: fontStyleDeclarations.small,
// };

// export interface LabelTextProps {
// 	size: ComponentSize;
// 	children: React.ReactNode;
// }

// export const LabelText = styled.span<LabelTextProps>`
// 	${p => labelSizeStyles[p.size]};
// 	font-weight: ${FontWeight.medium};
// `;

// export interface IconLabelProps extends LabelTextProps, IconWrapperProps {

// }

// export const IconLabel: StyledFC<IconLabelProps> = (props) => {
// 	const { leftIcon, rightIcon, size, children, justifyContent, className, ...otherProps } = props;

// 	const textRender = <>{children}</>;

// 	let iconRender: JSX.Element = textRender;

// 	if (leftIcon || rightIcon) {
// 		iconRender = (
// 			<IconWrapper size={size} leftIcon={leftIcon} rightIcon={rightIcon} justifyContent={justifyContent}>
// 				{children}
// 			</IconWrapper>
// 		);
// 	}

// 	return (
// 		<LabelText className={className} size={size} {...otherProps}>
// 			{iconRender}
// 		</LabelText>
// 	);
// };