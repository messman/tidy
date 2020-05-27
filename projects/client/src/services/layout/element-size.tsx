import * as React from 'react';
import { useWindowDimensions } from './window-dimensions';

export interface ElementSize {
	isSizing: boolean,
	width: number,
	height: number;
}

const defaultElementSize: ElementSize = {
	width: -1,
	height: -1,
	isSizing: true
};

export function useElementSize<T extends HTMLElement>(ref: React.MutableRefObject<T | null>, throttleMilliseconds: number | null, additionalDependencies: any[] | null): ElementSize {
	const windowDimensions = useWindowDimensions();
	const [size, setSize] = React.useState<ElementSize>(() => {
		return defaultElementSize;
	});
	const throttleTimeoutId = React.useRef(-1);
	const timeout = (isNaN(throttleMilliseconds!) || throttleMilliseconds! < 10) ? 10 : throttleMilliseconds;

	React.useEffect(function () {
		if (throttleTimeoutId.current !== -1) {
			return;
		}

		throttleTimeoutId.current = window.setTimeout(function () {
			throttleTimeoutId.current = -1;
			if (ref.current) {
				const rect = ref.current.getBoundingClientRect();
				setSize({
					width: rect.width,
					height: rect.height,
					isSizing: false
				});
			}
		}, timeout);

		if (size === defaultElementSize) {
			// This is our first run, disregard.
			return;
		}

		// While in progress, don't continuously update.
		setSize((previous) => {
			return {
				width: previous.width,
				height: previous.height,
				isSizing: true
			};
		});

	}, [ref.current, windowDimensions, ...(additionalDependencies || [])]);

	return size;
}