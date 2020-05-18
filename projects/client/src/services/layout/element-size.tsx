import * as React from 'react';

export interface ElementSize {
	isSizing: boolean,
	width: number,
	height: number
}

export function useElementSize<T extends HTMLElement>(ref: React.MutableRefObject<T | null>, throttleTimeoutMs?: number): ElementSize {
	const [size, setSize] = React.useState<ElementSize>(() => {
		return {
			width: -1,
			height: -1,
			isSizing: true
		}
	});
	const throttleTimeoutId = React.useRef(-1);
	const timeout = (isNaN(throttleTimeoutMs!) || throttleTimeoutMs! < 10) ? 10 : throttleTimeoutMs;

	function handleChange() {
		if (throttleTimeoutId.current === -1) {
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

			// While in progress, don't continuously update.
			setSize((previous) => {
				return {
					width: previous.width,
					height: previous.height,
					isSizing: true
				}
			});
		}
	}

	React.useLayoutEffect(function () {
		if (!ref.current) {
			return;
		}

		handleChange();

		window.addEventListener('resize', handleChange, { capture: true });
		window.addEventListener('orientationchange', handleChange, { capture: true });
		window.addEventListener('visibilitychange', handleChange, { capture: true });

		return function () {
			window.removeEventListener('resize', handleChange, { capture: true });
			window.removeEventListener('orientationchange', handleChange, { capture: true });
			window.removeEventListener('visibilitychange', handleChange, { capture: true });
		}
	}, [ref.current]);

	return size;
}