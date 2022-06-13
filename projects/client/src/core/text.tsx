import { defaultLetterSpacing, defaultLineHeight, FontSize, FontWeight } from './theme/font';
import { css, styled, ThemedCSS } from './theme/styled';

export const ellipsisStyle = css`
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

export const fontStyleDeclarations: Record<keyof typeof FontSize, ThemedCSS> = {
	display1: css`
		font-size: ${FontSize.display1};
		line-height: ${defaultLineHeight};
		letter-spacing: ${defaultLetterSpacing};
		font-weight: ${FontWeight.bold};
	`,
	display2: css`
		font-size: ${FontSize.display2};
		line-height: ${defaultLineHeight};
		letter-spacing: ${defaultLetterSpacing};
		font-weight: ${FontWeight.regular};
	`,
	heading1: css`
		font-size: ${FontSize.heading1};
		line-height: 3.375rem;
		letter-spacing: ${defaultLetterSpacing};
		font-weight: ${FontWeight.bold};
	`,
	heading2: css`
		font-size: ${FontSize.heading2};
		line-height: 2.75rem;
		letter-spacing: ${defaultLetterSpacing};
		font-weight: ${FontWeight.bold};
	`,
	heading3: css`
		font-size: ${FontSize.heading3};
		line-height: 2.375rem;
		letter-spacing: ${defaultLetterSpacing};
		font-weight: ${FontWeight.bold};
	`,
	heading4: css`
		font-size: ${FontSize.heading4};
		line-height: 2rem;
		letter-spacing: ${defaultLetterSpacing};
		font-weight: ${FontWeight.bold};
	`,
	heading5: css`
		font-size: ${FontSize.heading5};
		line-height: 1.75rem;
		letter-spacing: ${defaultLetterSpacing};
		font-weight: ${FontWeight.bold};
	`,
	heading6: css`
		font-size: ${FontSize.heading6};
		line-height: 1.375rem;
		letter-spacing: ${defaultLetterSpacing};
		font-weight: ${FontWeight.bold};
	`,
	leadLarge: css`
		font-size: ${FontSize.leadLarge};
		line-height: 1.5rem;
		letter-spacing: ${defaultLetterSpacing};
		font-weight: ${FontWeight.bold};
	`,
	lead: css`
		font-size: ${FontSize.lead};
		line-height: 1.5rem;
		letter-spacing: ${defaultLetterSpacing};
		font-weight: ${FontWeight.bold};
	`,
	leadSmall: css`
		font-size: ${FontSize.leadSmall};
		line-height: 1.5rem;
		letter-spacing: ${defaultLetterSpacing};
		font-weight: ${FontWeight.bold};
	`,
	body: css`
		font-size: ${FontSize.body};
		line-height: 1.5rem;
		letter-spacing: ${defaultLetterSpacing};
		font-weight: ${FontWeight.regular};
	`,
	// Font size of the small, line height of the body
	bodySmall: css`
		font-size: ${FontSize.small};
		line-height: 1.5rem;
		letter-spacing: 0.1px;
		font-weight: ${FontWeight.regular};
	`,
	small: css`
		font-size: ${FontSize.small};
		line-height: 1rem;
		letter-spacing: 0.1px;
		font-weight: ${FontWeight.regular};
	`,
	capital: css`
		font-size: ${FontSize.capital};
		line-height: ${defaultLineHeight};
		letter-spacing: ${defaultLetterSpacing};
		font-weight: ${FontWeight.regular};
		text-transform: uppercase;
		letter-spacing: 2px;
	`,
	tiny: css`
		font-size: ${FontSize.tiny};
		line-height: .875rem;
		letter-spacing: 0.2px;
		font-weight: ${FontWeight.medium};
	`,
};

export const paragraphMargin = '.5rem';
export const paragraphMarginStyle = css`
	& + & {
		margin-top: ${paragraphMargin};
	}
`;

/**
 * A specific purposeful paragraph component.
 * p-tag, margin, subtle text color, body style.
 * Defined here because of how common it is.
 */
export const Paragraph = styled.p`
	margin: 0;
	${fontStyleDeclarations.body};
	color: ${p => p.theme.textSubtle};
	${paragraphMarginStyle}
`;