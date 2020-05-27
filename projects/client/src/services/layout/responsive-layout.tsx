import * as React from 'react';
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

export interface ResponsiveLayout {
	widthBreakpoint: number,
	heightBreakpoint: number,
	mode: LayoutMode;
}

export function isInvalidLayoutForApplication(layout: ResponsiveLayout): boolean {
	return layout.heightBreakpoint < LayoutBreakpoint.regular;
}

function getLayout(dimensions: WindowDimensions, lowerBreakpoints: number[]): ResponsiveLayout {

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
	};
}

const ResponsiveLayoutContext = React.createContext<ResponsiveLayout>(null!);
export const useResponsiveLayout = () => React.useContext(ResponsiveLayoutContext);

export interface ResponsiveLayoutProviderProps {
	lowerBreakpoints: number[];
}

export const ResponsiveLayoutProvider: React.FC<ResponsiveLayoutProviderProps> = (props) => {

	const dimensions = useWindowDimensions();
	const [layout, setLayout] = React.useState<ResponsiveLayout>(() => {
		return getLayout(dimensions, props.lowerBreakpoints);
	});

	React.useEffect(() => {
		const newLayout = getLayout(dimensions, props.lowerBreakpoints);
		if (newLayout.widthBreakpoint !== layout.widthBreakpoint || newLayout.heightBreakpoint !== layout.heightBreakpoint || newLayout.mode !== layout.mode) {
			setLayout(newLayout);
		}
	}, [dimensions.width, dimensions.height]);

	return (
		<ResponsiveLayoutContext.Provider value={layout}>
			{props.children}
		</ResponsiveLayoutContext.Provider>
	);
};