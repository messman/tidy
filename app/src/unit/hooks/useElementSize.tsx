import { useState, useRef, useLayoutEffect } from "react";

export interface ElementSize {
	width: number,
	height: number
}

export function useElementSize<T extends HTMLElement>(ref: React.MutableRefObject<T>, throttleTimeoutMs?: number): ElementSize {
	const [size, setSize] = useState<ElementSize>({ width: -1, height: -1 });
	const throttleTimeoutId = useRef(-1);
	const timeout = (isNaN(throttleTimeoutMs) || throttleTimeoutMs < 10) ? 10 : throttleTimeoutMs;

	function handleChange() {
		if (throttleTimeoutId.current === -1) {
			throttleTimeoutId.current = window.setTimeout(function () {
				throttleTimeoutId.current = -1;
				if (ref.current) {
					const rect = ref.current.getBoundingClientRect();
					setSize(function (previousSize) {
						if (previousSize.width === rect.width && previousSize.height === rect.height) {
							return previousSize;
						}
						return {
							width: rect.width,
							height: rect.height
						};
					});
				}
			}, timeout);
		}
	}

	useLayoutEffect(function () {
		if (!ref.current) {
			return;
		}

		handleChange();

		window.addEventListener("resize", handleChange, { capture: true });
		window.addEventListener("orientationchange", handleChange, { capture: true });
		window.addEventListener("visibilitychange", handleChange, { capture: true });

		return function () {
			window.removeEventListener("resize", handleChange, { capture: true });
			window.removeEventListener("orientationchange", handleChange, { capture: true });
			window.removeEventListener("visibilitychange", handleChange, { capture: true });
		}
	}, [ref.current]);

	return size;
}