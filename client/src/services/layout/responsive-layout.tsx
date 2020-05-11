import * as React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { useWindowDimensions, WindowDimensions } from './window-dimensions';

export enum LayoutBreakpoint {
	compact = 0,
	regular = 500,
	wide = 1200
}
export const defaultLowerBreakpoints: number[] = [LayoutBreakpoint.compact, LayoutBreakpoint.regular, LayoutBreakpoint.wide];

export enum LayoutMode {
	landscape,
	portrait,
	square
}

export interface Layout {
	widthBreakpoint: number,
	heightBreakpoint: number,
	mode: LayoutMode
}

export function isInvalidLayoutForApplication(layout: Layout): boolean {
	return layout.heightBreakpoint < LayoutBreakpoint.regular;
}

function getLayout(dimensions: WindowDimensions, lowerBreakpoints: number[]): Layout {

	const lowest = lowerBreakpoints[0];
	let newWidthBreakpoint = lowest;
	let newHeightBreakpoint = lowest;
	// Loop through breakpoints from largest to smallest looking for the largest match
	for (let i = lowerBreakpoints.length - 1; i >= 0; i--) {
		const breakpoint = lowerBreakpoints[i];
		if (newWidthBreakpoint === lowest && dimensions.width > breakpoint) {
			newWidthBreakpoint = breakpoint;
		}
		if (newHeightBreakpoint === lowest && dimensions.height > breakpoint) {
			newHeightBreakpoint = breakpoint;
		}
	}

	const newMode = dimensions.width > dimensions.height ? LayoutMode.landscape : (dimensions.height > dimensions.width ? LayoutMode.portrait : LayoutMode.square);

	return {
		widthBreakpoint: newWidthBreakpoint,
		heightBreakpoint: newHeightBreakpoint,
		mode: newMode
	}
}

function useLayout(lowerBreakpoints: number[]): Layout {

	const dimensions = useWindowDimensions();
	const [layout, setLayout] = useState<Layout>(() => {
		return getLayout(dimensions, lowerBreakpoints);
	});

	useEffect(() => {
		const newLayout = getLayout(dimensions, lowerBreakpoints);
		if (newLayout.widthBreakpoint !== layout.widthBreakpoint || newLayout.heightBreakpoint !== layout.heightBreakpoint || newLayout.mode !== layout.mode) {
			setLayout(newLayout);
		}
	}, [dimensions.width, dimensions.height]);

	return layout;
}

const ResponsiveLayoutContext = createContext<Layout>(null!);
export const useResponsiveLayout = () => useContext<Layout>(ResponsiveLayoutContext);

export interface ResponsiveLayoutProviderProps {
	lowerBreakpoints: number[]
}

export const ResponsiveLayoutProvider: React.FC<ResponsiveLayoutProviderProps> = (props) => {
	const responsiveLayout = useLayout(props.lowerBreakpoints);

	return (
		<ResponsiveLayoutContext.Provider value={responsiveLayout}>
			{props.children}
		</ResponsiveLayoutContext.Provider>
	)
}