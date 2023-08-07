import { WindowLayout } from '@messman/react-common';

// Customized breakpoints based on design.
export enum LayoutBreakpointRem {
	/** 0. */
	a0 = 0,

	/** 20rem = 320px. Absolute minimum we will support. iPhone 5 / SE. */
	b20Min = 20,

	/** 30rem = 480px. Past most mobile phones and into tablets. */
	c30 = 30,

	/** 40rem = 640px. Tablets. */
	d40 = 40,

	/** 50rem = 800px. Tablets. */
	e50 = 50,

	/** 60rem = 960px. Desktop. */
	f60 = 60,

	/** 70rem = 1120px. Desktop. */
	g70 = 70,

	/** 90rem = 1440px. Wide. */
	h90 = 90,

	/** 100rem = 1600px. Wide. */
	i100 = 100,

	/** 120rem = 1920px. Ultra-wide. */
	j120Max = 120,
}
/** Maximum line length that we accept for paragraphs of text, in rem. */
export const lineBreakpoint = '40rem';

export const lowerBreakpoints: number[] = [
	LayoutBreakpointRem.a0,
	LayoutBreakpointRem.b20Min,
	LayoutBreakpointRem.c30,
	LayoutBreakpointRem.d40,
	LayoutBreakpointRem.e50,
	LayoutBreakpointRem.f60,
	LayoutBreakpointRem.g70,
	LayoutBreakpointRem.h90,
	LayoutBreakpointRem.i100,
	LayoutBreakpointRem.j120Max,
];

export function isInvalidLayout(windowLayout: WindowLayout): boolean {
	// If height is too small, it's invalid.
	// Remember that these breakpoints are the lower end of their range.
	return windowLayout.heightBreakpoint < LayoutBreakpointRem.c30;
}

export function isCompactWidthLayout(widthBreakpoint: number): boolean {
	return widthBreakpoint < LayoutBreakpointRem.d40;
}