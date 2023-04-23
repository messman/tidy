
/* NOTE - importing from anywhere outside of primitive will cause circular dependency issues #REF_CIRC_DEPEND */

import { css } from 'styled-components';

export type ComponentSize = 'small' | 'medium';

export enum Spacing {
	/** 1/9: .25rem / 4px */
	ant04 = '.25rem',
	/** 2/9: .5rem / 8px */
	bat08 = '.5rem',
	/** 3/9: .75rem / 12px */
	cat12 = '.75rem',
	/** 4/9: 1rem / 16px */
	dog16 = '1rem',
	/** 5/9: 1.5rem / 24px */
	elf24 = '1.5rem',
	/** 6/9: 2rem / 32px */
	fan32 = '2rem',
	/** 7/9: 2.5rem / 40px */
	guy40 = '2.5rem',
	/** 8/9: 3.5rem / 56px */
	hut56 = '3.5rem',
	/** 9/9: 4rem / 64px */
	inn64 = '4rem',
}

/**
 * Note that only absolute components need z-index. There's rarely a need to
 * add z-index otherwise.
*/
export enum ZIndex {
	/** Behind the application. */
	a_hidden = -1,
	/** Just covering the regular content. */
	b_cover = 10,
	/** Navigation components. */
	c_navigation = 20,
	/** Content / Edit overlays. */
	d_content = 30, // <=== This is what you usually want.
	/** Notification components.  */
	e_notification = 40,
	/** Auth cover components. */
	f_auth = 50,
	/** Application error components. */
	g_dialog = 60,
	/** Loading cover components. */
	h_loading = 70,
	/** Max. */
	i_maximum = 80
}

/** Regular border radius, for buttons/components. */
export const borderRadiusValue = '.5rem';
/** Double the border radius, for special maths. */
export const borderRadiusDoubleValue = '1rem';
/** Regular border radius, for buttons/components. */
export const borderRadiusStyle = css`
	border-radius: ${borderRadiusValue};
`;

/** The minimum size for a touchable target. */
export const minTouchSize = '2.5rem';

/** Larger border radius, for modals. */
export const largeBorderRadiusValue: string = '1rem';
/** Larger border radius, for modals. */
export const largeBorderRadiusStyle = css`
	border-radius: ${largeBorderRadiusValue};
`;

export const fontFamily = `'Poppins', sans-serif;`;
export const fontFamilyMonospace = 'Courier New';
export const fontDefaultSize = '1rem';

export const FontWeight = {
	regular: 400,
	medium: 500,
	bold: 700
} as const;