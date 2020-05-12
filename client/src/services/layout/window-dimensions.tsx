import * as React from 'react';

export interface WindowDimensions {
	width: number,
	height: number
}

export function useWindowDimensions() {
	const [dimensions, setDimensions] = React.useState<WindowDimensions>({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	React.useEffect(() => {
		function handleChange(): void {
			const newInnerWidth = window.innerWidth;
			const newInnerHeight = window.innerHeight;
			if (newInnerWidth !== dimensions.width || newInnerHeight !== dimensions.height) {
				setDimensions({
					width: window.innerWidth,
					height: window.innerHeight,
				});
			}
		}

		window.addEventListener('resize', handleChange, { capture: true });
		window.addEventListener('orientationchange', handleChange, { capture: true });
		window.addEventListener('visibilitychange', handleChange, { capture: true });

		return function () {
			window.removeEventListener('resize', handleChange, { capture: true });
			window.removeEventListener('orientationchange', handleChange, { capture: true });
			window.removeEventListener('visibilitychange', handleChange, { capture: true });
		}
	}, []);

	return dimensions;
}

const WindowDimensionsContext = React.createContext<WindowDimensions>(null!);
export const useWindowDimensionsContext = () => React.useContext(WindowDimensionsContext);

export const WindowDimensionsProvider: React.FC = (props: React.ComponentProps<any>) => {
	const dimensions = useWindowDimensions();

	return (
		<WindowDimensionsContext.Provider value={dimensions}>
			{props.children}
		</WindowDimensionsContext.Provider>
	)
}