// Note: make sure you check everywhere when replacing font file.
// Also: TODO: we should self-host the fonts file.

export const fontFamily = `'Poppins', sans-serif;`;
export const fontFamilyMonospace = 'Courier New';

export type ComponentSize = 'small' | 'medium';

export enum FontWeight {
	regular = 400,
	medium = 500,
	bold = 700
};

// Unit-less value means "multiply by font size".
export const defaultLineHeight = '1.2';
export const defaultLetterSpacing = 'normal';

export interface FontStyle {
	size: string;
	lineHeight: string;
	letterSpacing: string;
}

// Defaults for headings: 2, 1.5, 1.17, 1, ....
export enum FontSize {
	display1 = '4rem',
	display2 = '3.5rem',
	heading1 = '2.5rem',
	heading2 = '2rem',
	heading3 = '1.75rem',
	heading4 = '1.5rem',
	heading5 = '1.25rem',
	heading6 = '1rem',
	leadLarge = '1.125rem', // 18px
	lead = '1rem',
	leadSmall = '.875rem', // 14px
	body = '1rem', // 16px
	bodySmall = '.875rem', // 14px
	small = '.875rem', // 14px
	capital = '.875rem',
	tiny = '.625rem' // 10px
}