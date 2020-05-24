import * as React from 'react';

export interface WindowDimensions {
	width: number,
	height: number;
}

/*
	Unfortunately, checking for resize events isn't perfect.
	On mobile iOS Safari, for example, when rotating from landscape to portrait the events all are fired 
	before the rotation is complete/calculated, so the new dimensions are still in landscape!
	To fix this: run once immediately (to cover desktop), then run again on a delay to make sure it's right.

	TODO - Perhaps we could achieve this with matchMedia instead so that all changes would be in line with CSS.
*/
const delayTimeout = 500;

export function useWindowDimensions() {
	const [dimensions, setDimensions] = React.useState<WindowDimensions>({
		width: window.innerWidth,
		height: window.innerHeight,
	});
	const delayTimeoutId = React.useRef(-1);

	React.useEffect(() => {

		function checkDimensions(): void {
			const newInnerWidth = window.innerWidth;
			const newInnerHeight = window.innerHeight;
			if (newInnerWidth !== dimensions.width || newInnerHeight !== dimensions.height) {
				setDimensions({
					width: window.innerWidth,
					height: window.innerHeight,
				});
			}
		}

		function handleChange(): void {
			checkDimensions();

			if (delayTimeoutId.current !== -1) {
				return;
			}
			delayTimeoutId.current = window.setTimeout(function () {
				delayTimeoutId.current = -1;
				checkDimensions();
			}, delayTimeout);
		}

		window.addEventListener('resize', handleChange);
		window.addEventListener('orientationchange', handleChange);
		window.addEventListener('visibilitychange', handleChange);

		return function () {
			window.removeEventListener('resize', handleChange);
			window.removeEventListener('orientationchange', handleChange);
			window.removeEventListener('visibilitychange', handleChange);
		};
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
	);
};