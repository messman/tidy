import * as React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { useWindowDimensions, WindowDimensions } from "./useWindowDimensions";


export interface PickLayout {
	(dimensions: WindowDimensions): number
}

function useResponsiveLayout(pickLayout: PickLayout): number {

	const dimensions = useWindowDimensions();
	const [layout, setLayout] = useState(pickLayout(dimensions));

	useEffect(() => {
		setLayout(pickLayout(dimensions));

	}, [dimensions.width, dimensions.height]);

	return layout;
}

const ResponsiveLayoutCtx = createContext<number>(null!);
export const useResponsiveLayoutContext = () => useContext<number>(ResponsiveLayoutCtx);

export interface ResponsiveLayoutProviderProps {
	pickLayout: PickLayout
}

export const ResponsiveLayoutProvider: React.FC<ResponsiveLayoutProviderProps> = (props) => {
	const responsiveLayout = useResponsiveLayout(props.pickLayout);

	return (
		<ResponsiveLayoutCtx.Provider value={responsiveLayout}>
			{props.children}
		</ResponsiveLayoutCtx.Provider>
	)
}