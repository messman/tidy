import * as React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';

export interface WindowDimensions {
	width: number,
	height: number
}

export function useWindowDimensions() {
	const [dimensions, setDimensions] = useState<WindowDimensions>({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	useEffect(() => {
		const handleResize = () => {
			setDimensions({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		}
		window.addEventListener("resize", handleResize);

		return function () {
			window.removeEventListener("resize", handleResize);
		}
	}, []);

	return dimensions;
}

const WindowDimensionsCtx = createContext<WindowDimensions>(null);
export const useWindowDimensionsContext = () => useContext(WindowDimensionsCtx);

export const WindowDimensionsProvider = ({ children }) => {
	const dimensions = useWindowDimensions();

	return (
		<WindowDimensionsCtx.Provider value={dimensions}>
			{children}
		</WindowDimensionsCtx.Provider>
	)
}