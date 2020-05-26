import * as React from 'react';

export interface ScrollOutput {
	scrollTop: number;
	scrollLeft: number;
}

export function useElementScroll<T extends HTMLElement>(ref: React.MutableRefObject<T | null>, throttleMilliseconds: number | null): ScrollOutput {
	const [scrollOutput, setScrollOutput] = React.useState<ScrollOutput>({
		scrollTop: ref.current?.scrollTop || 0,
		scrollLeft: ref.current?.scrollLeft || 0
	});

	const throttleTimeoutId = React.useRef(-1);
	const timeout = (isNaN(throttleMilliseconds!) || throttleMilliseconds! < 10) ? 10 : throttleMilliseconds;

	function checkScroll(event: Event | null): void {
		if (!ref.current) {
			return;
		}
		if (event && event.target !== ref.current) {
			return;
		}
		if (throttleTimeoutId.current !== -1) {
			return;
		}
		throttleTimeoutId.current = window.setTimeout(function () {
			throttleTimeoutId.current = -1;
			if (!ref.current) {
				return;
			}
			const newScrollTop = ref.current.scrollTop;
			const newScrollLeft = ref.current.scrollLeft;
			setScrollOutput((p) => {
				if (newScrollTop === p.scrollTop && newScrollLeft === p.scrollLeft) {
					return p;
				}
				return {
					scrollTop: newScrollTop,
					scrollLeft: newScrollLeft,
				};
			});
		}, timeout);
	}

	React.useEffect(() => {
		function handleChange(event: Event) {
			checkScroll(event);
		}

		checkScroll(null);

		if (ref.current) {
			ref.current.onscroll = handleChange;
		}
		return function () {
			if (ref.current) {
				ref.current.onscroll = null;
			}
		};
	}, [ref.current]);

	return scrollOutput;
};