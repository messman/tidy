import styled, { css, StyledComponent } from 'styled-components';
import { Space } from '../layout/layout-shared';
import { fontDefaultSize, fontFamily, FontWeight } from '../primitive/primitive-design';
import { CssOutput } from '../primitive/primitive-styled';
import { themeTokens } from '../theme/theme-root';

// Unit-less value means "multiply by font size".
export const defaultLineHeight = '1.2';
export const defaultLetterSpacing = 'normal';

export interface FontStyleDefinition {
	family: string;
	size: string;
	/** Often also used for total height - so it should be a rem value. */
	lineHeight: string;
	weight: number;
	margin: string;
	letterSpacing?: string;
	styles?: CssOutput;
}

export interface FontStyles<T> {
	display: {
		heavy: T;
		light: T;
	};
	headings: {
		h1: T;
		h2: T;
		h3: T;
		h4: T;
		h5: T;
		h6: T;
	};
	lead: {
		large: T;
		medium: T;
		small: T;
	};
	text: {
		medium: T;
		mediumHeavy: T;
		small: T;
		smallHeavy: T;
		tiny: T;
		tinyHeavy: T;
	};
	stylized: {
		blockquote: T;
		capitalized: T;
	};
}

export const fontStyleDefinitions = {
	display: {
		heavy: {
			family: fontFamily,
			size: '4rem',
			lineHeight: '6rem',
			weight: FontWeight.bold,
			margin: '3rem',
		} as const,
		light: {
			family: fontFamily,
			size: '3.5rem',
			lineHeight: '5.25rem',
			weight: FontWeight.regular,
			margin: '3rem',
		} as const,
	},
	headings: {
		h1: {
			family: fontFamily,
			size: '2.5rem',
			lineHeight: '3.375rem',
			weight: FontWeight.bold,
			margin: '2.5rem',
		} as const,
		h2: {
			family: fontFamily,
			size: '2rem',
			lineHeight: '2.75rem',
			weight: FontWeight.bold,
			margin: '2rem',
		} as const,
		h3: {
			family: fontFamily,
			size: '1.75rem',
			lineHeight: '2.375rem',
			weight: FontWeight.bold,
			margin: '1.75rem',
		} as const,
		h4: {
			family: fontFamily,
			size: '1.5rem',
			lineHeight: '2rem',
			weight: FontWeight.bold,
			margin: '1.5rem',
		} as const,
		h5: {
			family: fontFamily,
			size: '1.25rem',
			lineHeight: '1.75rem',
			weight: FontWeight.bold,
			margin: '1.25rem',
		} as const,
		h6: {
			family: fontFamily,
			size: '1rem',
			lineHeight: '1.375rem',
			weight: FontWeight.bold,
			margin: '1rem',
		} as const
	},
	lead: {
		large: {
			family: fontFamily,
			size: '1.125rem',
			lineHeight: '1.5rem',
			weight: FontWeight.bold,
			margin: '1.125rem',
		} as const,
		medium: {
			family: fontFamily,
			size: '1rem',
			lineHeight: '1.5rem',
			weight: FontWeight.bold,
			margin: '1rem',
		} as const,
		small: {
			family: fontFamily,
			size: '.875rem',
			lineHeight: '1.5rem',
			weight: FontWeight.bold,
			margin: '1rem',
		} as const
	},
	text: {
		medium: {
			family: fontFamily,
			size: fontDefaultSize,
			lineHeight: '1.5rem',
			weight: FontWeight.regular,
			margin: '1rem',
		} as const,
		mediumHeavy: {
			family: fontFamily,
			size: fontDefaultSize,
			lineHeight: '1.5rem',
			weight: FontWeight.medium,
			margin: '1rem',
		} as const,
		small: {
			family: fontFamily,
			size: '.875rem',
			lineHeight: '1.5rem',
			weight: FontWeight.regular,
			margin: '1rem',
		} as const,
		smallHeavy: {
			family: fontFamily,
			size: '.875rem',
			lineHeight: '1.5rem',
			weight: FontWeight.medium,
			margin: '1rem',
		} as const,
		tiny: {
			family: fontFamily,
			size: '.75rem',
			lineHeight: '1rem',
			weight: FontWeight.medium,
			margin: '1rem',
		} as const,
		tinyHeavy: {
			family: fontFamily,
			size: '.75rem',
			lineHeight: '1rem',
			letterSpacing: '-.5px',
			weight: FontWeight.semibold,
			margin: '1rem',
		} as const,
	},
	stylized: {
		blockquote: {
			family: fontFamily,
			size: '1.25rem',
			lineHeight: '1.75rem',
			weight: FontWeight.medium,
			margin: '1rem',
		} as const,
		capitalized: {
			family: fontFamily,
			size: '.875rem',
			lineHeight: '1.25rem',
			weight: FontWeight.regular,
			margin: '1rem',
			letterSpacing: '0.5px',
			styles: css`
				text-transform: uppercase;
			`
		} as const,
	}
} satisfies FontStyles<FontStyleDefinition>;

/**
 * Font styles to be used in a variety of contexts. No margin.
 * See elsewhere for hierarchy-based styles.
*/
export const fontStyles: FontStyles<CssOutput> = {
	display: {
		heavy: createDeclaration(fontStyleDefinitions.display.heavy),
		light: createDeclaration(fontStyleDefinitions.display.light),
	},
	headings: {
		h1: createDeclaration(fontStyleDefinitions.headings.h1),
		h2: createDeclaration(fontStyleDefinitions.headings.h2),
		h3: createDeclaration(fontStyleDefinitions.headings.h3),
		h4: createDeclaration(fontStyleDefinitions.headings.h4),
		h5: createDeclaration(fontStyleDefinitions.headings.h5),
		h6: createDeclaration(fontStyleDefinitions.headings.h6),
	},
	lead: {
		large: createDeclaration(fontStyleDefinitions.lead.large),
		medium: createDeclaration(fontStyleDefinitions.lead.medium),
		small: createDeclaration(fontStyleDefinitions.lead.small),
	},
	text: {
		medium: createDeclaration(fontStyleDefinitions.text.medium),
		mediumHeavy: createDeclaration(fontStyleDefinitions.text.mediumHeavy),
		small: createDeclaration(fontStyleDefinitions.text.small),
		smallHeavy: createDeclaration(fontStyleDefinitions.text.smallHeavy),
		tiny: createDeclaration(fontStyleDefinitions.text.tiny),
		tinyHeavy: createDeclaration(fontStyleDefinitions.text.tinyHeavy),
	},
	stylized: {
		blockquote: createDeclaration(fontStyleDefinitions.stylized.blockquote),
		capitalized: createDeclaration(fontStyleDefinitions.stylized.capitalized),
	}
};

/** Created only for this scenario, do not copy. Does not use margin. */
function createDeclaration(style: FontStyleDefinition): CssOutput {
	return css`
		margin: 0;
		font-family: ${style.family};
		font-size: ${style.size};
		line-height: ${style.lineHeight};
		letter-spacing: ${style.letterSpacing || defaultLetterSpacing};
		font-weight: ${style.weight};
		${style.styles || undefined};
	`;
}

interface FontDocs<T> {
	A_PageTitle: T;
	B_ViewTitle: T;
	C_Topic: T;
	D_Section: T;
	E_Paragraph: T;
	F_ParagraphSmall: T;
}

/** Defines the styles to use for a document-like information hierarchy. */
export const FontDoc = {
	A_PageTitle: {
		definition: fontStyleDefinitions.headings.h2,
		style: fontStyles.headings.h2,
		Component: styled.h2`
			${fontStyles.headings.h2}
			margin: ${fontStyleDefinitions.headings.h2.margin} 0;
		`
	},
	B_ViewTitle: {
		definition: fontStyleDefinitions.headings.h3,
		style: fontStyles.headings.h3,
		Component: styled.h3`
			${fontStyles.headings.h3}
			margin: ${fontStyleDefinitions.headings.h3.margin} 0;
		`
	},
	C_Topic: {
		definition: fontStyleDefinitions.headings.h4,
		style: fontStyles.headings.h4,
		Component: styled.h4`
			${fontStyles.headings.h4}
			margin: ${fontStyleDefinitions.headings.h4.margin} 0;
		`
	},
	D_Section: {
		definition: fontStyleDefinitions.lead.large,
		style: fontStyles.lead.large,
		Component: styled.div`
			${fontStyles.lead.large}
			margin: ${fontStyleDefinitions.lead.large.margin} 0;
		`
	},
	E_Paragraph: {
		definition: fontStyleDefinitions.text.medium,
		style: fontStyles.text.medium,
		Component: styled.div`
			${fontStyles.text.medium}
			margin: ${fontStyleDefinitions.text.medium.margin} 0;
			color: ${themeTokens.text.subtle};
		`
	},
	F_ParagraphSmall: {
		definition: fontStyleDefinitions.text.small,
		style: fontStyles.text.small,
		Component: styled.div`
			${fontStyles.text.small}
			margin: ${fontStyleDefinitions.text.small.margin} 0;
			color: ${themeTokens.text.subtle};
		`
	}
} satisfies FontDocs<{
	definition: FontStyleDefinition;
	style: CssOutput;
	Component: StyledComponent<any, any, {}, never>;
}>;

export const FontDocDefinitions = {
	A_PageTitle: fontStyleDefinitions.headings.h2,
	B_ViewTitle: fontStyleDefinitions.headings.h3,
	C_Topic: fontStyleDefinitions.headings.h4,
	D_Section: fontStyleDefinitions.lead.large,
	E_Paragraph: fontStyleDefinitions.text.medium,
	F_ParagraphSmall: fontStyleDefinitions.text.small,
} as const satisfies FontDocs<{}>;

/** Ensures that single line of text does not wrap or overflow and instead uses ellipses. */
export const ellipsisStyle = css`
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

/** Creates a two-line ellipses. */
export const ellipsisTwoLinesStyle = css`
	display: -webkit-box;
	-webkit-box-orient: vertical; 
	-webkit-line-clamp: 2;
	overflow: hidden;
	text-overflow: ellipsis;
`;

/** Space between paragraphs of text. */
export const paragraphMargin = Space.ColMin.value;
/** When applied to a paragraph component, ensures successive paragraphs are spaced with the set margin. */
export const paragraphMarginStyle = css`
	& + & {
		margin-top: ${paragraphMargin};
	}
`;

/**
 * A specific purposeful paragraph component.
 * p-tag, margin (only with siblings), subtle text color, body style.
 * Defined here because of how common it is.
 */
export const MediumBodyText = styled.p`
	margin: 0;
	${fontStyles.text.medium};
	color: ${themeTokens.text.distinct};
	${paragraphMarginStyle}
`;

/** Does one thing only: text-align: center. Extend as necessary. */
export const TextAlignCenter = styled.div`
	text-align: center;
`;