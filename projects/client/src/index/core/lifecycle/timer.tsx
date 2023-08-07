import * as React from 'react';
import { useDocumentVisibility, useEventCallback } from '@messman/react-common';

export interface SafeTimerOutput {
	change: (timeout: number | null) => void;
}

/**
 * On iOS, when a browser page is minimized or otherwise put to sleep, setTimeout may get paused.
 * We will avoid this by implementing the timer from a start time and listening to visibility events
 * to ensure the timer callback is called as soon as it can be.
 */
export function useSafeTimer(callback: () => void): SafeTimerOutput {

	const startedTimeRef = React.useRef(-1);
	const timeoutRef = React.useRef(-1);
	const timeoutIdRef = React.useRef(-1);

	const isVisible = useDocumentVisibility();
	const isVisibleRef = React.useRef(isVisible);

	const trigger = useEventCallback(callback);

	const dispose = React.useCallback(() => {
		window.clearTimeout(timeoutIdRef.current);
		timeoutIdRef.current = -1;
		timeoutRef.current = -1;
		startedTimeRef.current = -1;
	}, []);

	React.useEffect(() => {
		return () => {
			dispose();
		};
	}, []);

	const onComplete = React.useCallback(() => {
		const wasTimerActive = timeoutRef.current !== -1;
		dispose();
		if (wasTimerActive) {
			trigger(null);
		}
	}, [dispose]);

	React.useEffect(() => {
		// If visibility changed, check some things.
		if (isVisible !== isVisibleRef.current) {
			isVisibleRef.current = isVisible;

			// If we have a timer...
			if (timeoutRef.current !== -1) {

				// Clear the timeout regardless of visibility.
				window.clearTimeout(timeoutIdRef.current);
				if (isVisible) {
					// Restart the timer if visible.
					const timeElapsed = Date.now() - startedTimeRef.current;
					const timeout = Math.max(timeoutRef.current - timeElapsed, 0);

					if (timeout === 0) {
						onComplete();
					}
					else {
						timeoutIdRef.current = window.setTimeout(() => {
							onComplete();
						}, timeout);
					}
				}
			}
		}
	}, [isVisible, dispose, onComplete]);

	return React.useMemo<SafeTimerOutput>(() => {
		return {
			change: (timeout: number | null) => {
				if (timeout === null) {
					dispose();
				}
				else {
					startedTimeRef.current = Date.now();
					timeoutRef.current = timeout;
					timeoutIdRef.current = window.setTimeout(() => {
						onComplete();
					}, timeoutRef.current);
				}
			}
		};
	}, []);
}