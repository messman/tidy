import * as React from 'react';
import styled, { css } from 'styled-components';
import { SizedIcon } from '../icon/icon';
import { SpinnerIcon } from '../icon/icon-spinner';
import { outlineAccessibilityStyle, Space } from '../layout/layout-shared';
import { borderRadiusStyle, ComponentSize, Spacing } from '../primitive/primitive-design';
import { AttrsComponent, Styled } from '../primitive/primitive-styled';
import { IconLabel, IconLabelProps } from '../text/text-label';

const buttonPaddings: Record<ComponentSize, string> = {
	medium: `${Spacing.cat12} ${Spacing.dog16}`,
	small: `${Spacing.bat08} ${Spacing.cat12}`,
};

export interface BaseButtonProps {
	onClick?: () => void;
	isDisabled?: boolean;
	isLoading?: boolean;
	children: React.ReactNode;
}

export interface ButtonProps extends Omit<IconLabelProps, 'size'>, BaseButtonProps {
	title?: string;
	/** size defaults to medium for buttons. */
	size?: ComponentSize;
	/** Default is center. Controls where the loading spinner renders relative to the space given by the underlying hidden content. */
	loadingAlignment?: 'left' | 'right' | 'center';
};

/**
	These styles are meant to:
	- Replace any weird defaults added by browsers
	- Ensure every button has some of the basic necessary behaviors

	Note - we style buttons elsewhere. So don't do any specific design stuff here.
*/
export const buttonResetStyles = css`
	background-color: transparent;
	position: relative;
	border: none;
	border-radius: 0;
	color: inherit;
	padding: 0;
	margin: 0;

	cursor: pointer;
	font: inherit;

	:disabled {
		cursor: not-allowed;
	}

	${outlineAccessibilityStyle}
`;

/**
 * All UI buttons with the typical button look and feel are based on this.
 * 
 * NOTE: It assumes that only a label will be used inside it. If you mean to just wrap
 * regular content in a button element for clicking, see {@link ClickWrapperButton}
 * */
export const BaseButton = styled((props: Styled<ButtonProps>) => {
	const { children, size, leftIcon, rightIcon, justifyContent, isLoading, loadingAlignment, isDisabled, ...otherProps } = props;

	const componentSize: ComponentSize = size || 'medium';

	// This will appear over top of the button when loading.
	const spinnerRender = isLoading ? (
		<BaseButton_SpinnerCoverContainer justifyContent={loadingAlignment === 'left' ? 'flex-start' : (loadingAlignment === 'right' ? 'flex-end' : 'center')}>
			<SizedIcon size={componentSize} type={SpinnerIcon} />
		</BaseButton_SpinnerCoverContainer>
	) : null;

	// className is passed down to the BaseButton.
	return (
		<button {...otherProps} disabled={isDisabled}>
			<ZeroVisibilityWrapper isHidden={!!isLoading}>
				<IconLabel leftIcon={leftIcon} rightIcon={rightIcon} size={componentSize} justifyContent={justifyContent} >
					{children}
				</IconLabel>
			</ZeroVisibilityWrapper>
			{spinnerRender}
		</button>
	);
})``;

const ZeroVisibilityWrapper = styled.div.attrs((props: { isHidden: boolean; }) => {
	const style: Partial<CSSStyleDeclaration> = {};
	if (props.isHidden) {
		style.visibility = 'hidden';
	}
	return {
		style: style
	};
})`` as AttrsComponent<'div', { isHidden: boolean; }>;

const BaseButton_SpinnerCoverContainer = styled.div.attrs((props: { justifyContent: string; }) => {
	return {
		style: {
			justifyContent: props.justifyContent
		} as CSSStyleDeclaration
	};
})`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: ${p => p.justifyContent};
	align-items: center;
` as AttrsComponent<'div', { justifyContent: string; }>;


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

/** Simple row button container with right alignment. */
export const ButtonRightRowContainer = styled.div`
	display: flex;
	justify-content: flex-end;
	align-items: center;
	gap: ${Space.RowClose.value};
`;

/** Styles for 'regular' buttons - buttons with labels within them, and padding, and backgrounds, and borders. */
export const regularButtonStyles = css<ButtonProps>`
	${buttonResetStyles}
	${borderRadiusStyle}
	border: 1px solid transparent; // Ensures that buttons beside each other with different styles will have the same size
	padding: ${p => buttonPaddings[p.size || 'medium']};

	:disabled {
		box-shadow: none;
		border-color: transparent;
	}
`;

/** Usually the primary button in a list. */
export const ButtonFillBrandRed = styled(BaseButton)`
	${regularButtonStyles};
	
	background-color: ${'red'};
`;

/** Usually the primary button in a list. */
export const ButtonFillBrandBlue = styled(BaseButton)`
	${regularButtonStyles};
	
`;


const buttonPaddingsSimpleLink: Record<ComponentSize, string> = {
	medium: `${Spacing.cat12}`,
	small: `${Spacing.bat08}`,
};

/** A button that looks more like a link. */
export const ButtonSimpleLink = styled(BaseButton)`
	${regularButtonStyles};

	// Use tighter paddings because we have no background or border
	padding: ${p => buttonPaddingsSimpleLink[p.size || 'medium']};

	// Remove background
	background-color: transparent;
	:disabled {
		background-color: transparent;
	}
	color: ${'red'};
`;

/**
 * A special HTMLButtonElement that can contain any content and makes no 
 * assumptions about its content (other buttons assume label text).
 * The simplest form of button.
*/
export const ClickWrapperButton = styled.button<{ onClick: () => void; }>`
	${buttonResetStyles};
`;