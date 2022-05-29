import { css, styled } from './styled';

/** Regular border radius, for buttons/components. */
export const borderRadiusValue: string = '.5rem';
/** Regular border radius, for buttons/components. */
export const borderRadiusStyle = css`
	border-radius: ${borderRadiusValue};
`;

/** Larger border radius, for modals. */
export const largeBorderRadiusValue: string = '1rem';
/** Larger border radius, for modals. */
export const largeBorderRadiusStyle = css`
	border-radius: ${largeBorderRadiusValue};
`;

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

function createPadding(padding: string) {
	return styled.div`
		padding: ${padding};
	`;
}

export const Padding = {
	Ant04: createPadding(Spacing.ant04),
	Bat08: createPadding(Spacing.bat08),
	Cat12: createPadding(Spacing.cat12),
	Dog16: createPadding(Spacing.dog16),
	Elf24: createPadding(Spacing.elf24),
	Fan32: createPadding(Spacing.fan32),
	Guy40: createPadding(Spacing.guy40),
	Hut56: createPadding(Spacing.hut56),
	Inn64: createPadding(Spacing.inn64),
};

function createBlock(spacing: string) {
	return styled.div`
		width: ${spacing};
		height: ${spacing};
		flex-shrink: 0;
	`;
}

export const Block = {
	Ant04: createBlock(Spacing.ant04),
	Bat08: createBlock(Spacing.bat08),
	Cat12: createBlock(Spacing.cat12),
	Dog16: createBlock(Spacing.dog16),
	Elf24: createBlock(Spacing.elf24),
	Fan32: createBlock(Spacing.fan32),
	Guy40: createBlock(Spacing.guy40),
	Hut56: createBlock(Spacing.hut56),
	Inn64: createBlock(Spacing.inn64),
};