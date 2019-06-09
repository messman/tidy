import * as React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { useWindowDimensions, WindowDimensions } from "./useWindowDimensions";

export enum ResponsiveLayoutType {
	compact,
	regular,
	wide
}

export interface PickLayout {
	(dimensions: WindowDimensions): ResponsiveLayoutType
}

function useResponsiveLayout(pickLayout: PickLayout): ResponsiveLayoutType {

	const dimensions = useWindowDimensions();
	const [layout, setLayout] = useState(pickLayout(dimensions));

	useEffect(() => {
		setLayout(pickLayout(dimensions));

	}, [dimensions.width, dimensions.height]);

	return layout;
}

const ResponsiveLayoutCtx = createContext<ResponsiveLayoutType>(null);
export const useResponsiveLayoutContext = () => useContext(ResponsiveLayoutCtx);

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