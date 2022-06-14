import * as React from 'react';
import { SizedIcon } from '../icon/icon';
import { SpinnerIcon } from '../icon/icon-spinner';
import { IconLabel, IconLabelProps, labelSizeStyles, LabelText } from '../label';
import { borderRadiusStyle, Spacing } from '../theme/box';
import { outlineStyle } from '../theme/common';
import { ComponentSize } from '../theme/font';
import { css, styled, StyledFC } from '../theme/styled';

const buttonPaddings: Record<ComponentSize, string> = {
	medium: `${Spacing.bat08} ${Spacing.dog16}`,
	small: `${Spacing.bat08} ${Spacing.cat12}`,
};

export interface ButtonProps extends Omit<IconLabelProps, 'size'> {
	title?: string;
	onClick: () => void;
	isSelected?: boolean;
	isDisabled?: boolean;
	isLoading?: boolean;
	/** size defaults to medium for buttons. */
	size?: ComponentSize;
};

/*
	These styles are meant to:
	- Replace any weird defaults added by browsers
	- Ensure every button has some of the basic necessary behaviors

	Note - we make buttons elsewhere. So don't do any specific design stuff here.
*/
export const buttonResetStyles = css`
	position: relative;
	border: none;
	border-radius: 0;
	color: inherit;
	padding: 0;
	cursor: pointer;
	font: inherit;

	:disabled {
		cursor: not-allowed;
	}

	:focus {
		${outlineStyle}
	}
`;

/** Used for references in styled-components wrappers. */
export const BaseButton = styled.button<ButtonProps>``;

export const BaseButtonWrapper: StyledFC<ButtonProps> = (props) => {
	const { children, size, isSelected, leftIcon, rightIcon, justifyContent, isLoading, isDisabled, ...otherProps } = props;

	const componentSize: ComponentSize = size || 'medium';

	const iconLabelRender = (
		<IconLabel leftIcon={leftIcon} rightIcon={rightIcon} size={componentSize} justifyContent={justifyContent} >
			{children}
		</IconLabel>
	);

	// In the future, make a wrapper over the button instead that can take success/failure states.
	const render = isLoading ? (
		<>
			<ZeroVisibilityWrapper>
				{iconLabelRender}
			</ZeroVisibilityWrapper>
			<AbsoluteFlexRow>
				<LabelText size={componentSize}>
					<SizedIcon size={componentSize} type={SpinnerIcon} />
				</LabelText>
			</AbsoluteFlexRow>
		</>
	) : iconLabelRender;

	// className is passed down to the BaseButton.
	return (
		<BaseButton {...otherProps} size={size} isSelected={isSelected} disabled={isDisabled}>
			{render}
		</BaseButton>
	);
};

const ZeroVisibilityWrapper = styled.div`
	visibility: hidden;
`;

const AbsoluteFlexRow = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
`;


/** Include this style in a parent to make buttons 100% width. */
export const buttonFullWidthInContainerStyle = css`
	${BaseButton} {
		width: 100%;
	}
`;

export const ButtonFullWidthContainer = styled.div`
	${BaseButton} {
		width: 100%;
	}
	${BaseButton} + ${BaseButton} {
		margin-top: ${Spacing.bat08};
	}
`;

export const baseButtonStyles = css<ButtonProps>`
	${buttonResetStyles}

	// ensure buttons are not different heights when one is styled with a border
	border: 1px solid transparent;
	${borderRadiusStyle};

	padding: ${p => buttonPaddings[p.size || 'medium']};
	${p => labelSizeStyles[p.size || 'medium']};

	:disabled {
		color: ${p => p.theme.form.textDisabled};
		${LabelText} {
			color: ${p => p.theme.form.textDisabled};
		}
	}
`;

/** Not every button has a shadow. */
export const buttonShadowStyles = css`
	box-shadow: ${p => p.theme.shadow.c_button};

	:hover {
		box-shadow: ${p => p.theme.shadow.e_raised};
	}
	:active {
		box-shadow: ${p => p.theme.shadow.b_card};
	}
	:disabled {
		box-shadow: ${p => p.theme.shadow.a_background};
	}
`;

export const colorStyles = {
	brandA: css`
		background-color: ${p => p.theme.button.base};
		${LabelText} {
			color: #FFFFFF;
		}

		:hover {
			background-color: ${p => p.theme.button.hover};
		}
		:active {
			background-color: ${p => p.theme.button.active};
		}

		:disabled {
			${LabelText} {
				color: ${p => p.theme.form.textDisabled};
			}
			background-color: ${p => p.theme.form.disabled};
		}
	`,
};

/*
	How to create your own button:
	- Create your css styles
	- Create the button from `styled(BaseButtonWrapper)` with your style at the end of the list
*/

export const StandardButton = styled(BaseButtonWrapper)`
	${baseButtonStyles}
	${buttonShadowStyles}
	${colorStyles.brandA};
`;

export const WrapperButton = styled(BaseButtonWrapper)`
	${baseButtonStyles}
	border: none;
	padding: 0;
	margin: 0;
	background-color: transparent;
	${LabelText} {
		color: ${p => p.theme.common.brand1.main};
	}
`;