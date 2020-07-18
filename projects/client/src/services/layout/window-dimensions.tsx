import * as React from 'react';

export interface WindowDimensions {
	width: number;
	height: number;
}

/*
	Unfortunately, checking for resize events isn't perfect.
	The code below works for iOS Safari by explicitly *not* relying on the old orientationchanged event, which is always "late" 
	and provides width/height from *before* the event half the time.
	This is fixed by only relying on resize, visibilitychange, and the MediaQuery for orientation.
	Also, we use document.documentElement.clientWidth instead of window.innerWidth, which seems to respond correctly.
*/

const WindowDimensionsContext = React.createContext<WindowDimensions>(null!);
export const WindowDimensionsProvider: React.FC = (props: React.ComponentProps<any>) => {
	const [dimensions, setDimensions] = React.useState<WindowDimensions>({
		width: window.innerWidth,
		height: window.innerHeight,
	});
	const resizeMQL = React.useRef(window.matchMedia('(orientation: portrait)'));

	function checkDimensions(reason: string): void {
		const newInnerWidth = window.innerWidth;
		const newInnerHeight = window.innerHeight;
		console.log(newInnerWidth, newInnerHeight, reason, document.documentElement.clientWidth, document.documentElement.clientHeight);
		setTimeout(() => {
			console.log(newInnerWidth, newInnerHeight, reason, document.documentElement.clientWidth, document.documentElement.clientHeight, 2);
		}, 50);
		setDimensions((p) => {
			if (newInnerWidth === p.width && newInnerHeight === p.height) {
				return p;
			}
			return {
				width: newInnerWidth,
				height: newInnerHeight,
			};
		});
	}

	React.useEffect(() => {
		function handleChangeR() {
			checkDimensions('resize');
		}
		function handleChangeV() {
			checkDimensions('visibility');
		}
		function handleChangeM() {
			checkDimensions('mql');
		}
		if (resizeMQL.current) {
			resizeMQL.current.addListener(handleChangeM);
		}
		window.addEventListener('resize', handleChangeR);
		window.addEventListener('visibilitychange', handleChangeV);
		return function () {
			if (resizeMQL.current) {
				resizeMQL.current.removeListener(handleChangeM);
			}
			window.removeEventListener('resize', handleChangeR);
			window.removeEventListener('visibilitychange', handleChangeV);
		};


		// function handleChange() {
		// 	checkDimensions();
		// }
		// if (resizeMQL.current) {
		// 	resizeMQL.current.addListener(handleChange);
		// }
		// window.addEventListener('resize', handleChange);
		// window.addEventListener('visibilitychange', handleChange);
		// return function () {
		// 	if (resizeMQL.current) {
		// 		resizeMQL.current.removeListener(handleChange);
		// 	}
		// 	window.removeEventListener('resize', handleChange);
		// 	window.removeEventListener('visibilitychange', handleChange);
		// };
	}, []);

	return (
		<WindowDimensionsContext.Provider value={dimensions}>
			{props.children}
		</WindowDimensionsContext.Provider>
	);
};
export const useWindowDimensions = () => React.useContext(WindowDimensionsContext);