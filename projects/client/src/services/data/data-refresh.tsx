import * as React from 'react';
import { CONSTANT } from '../constant';
import { PromiseOutput } from '../promise';

export function usePromiseRefresh<T>(promiseOutput: PromiseOutput<T> | null) {

	/*
		Here's the need:
		The information we load becomes stale quickly. We need to refresh the page automatically after some time.
		This is particularly important when the app is added to the home screen, because there is no refresh button.

		JS may not run when the tab or app is closed. So we should look to the visibility API.

		Here's the plan:
		Whenever a successful response is seen, start tracking the time in two ways:
		- a setTimeout
		- a stored variable of the current time
		If the user stays on the screen for the time of the timeout, great - we will force refresh then.
		If the application is closed or the tab switched, we cancel the setTimeout and recreate it with the remaining time when the application is back up again.
		If the promise is ever refreshed through this process, stop tracking.
	*/

	// These destructured variables will be undefined if there is no promiseOutput - like when we are using local data.
	const { isRunning, error, data, promiseFunc, run } = promiseOutput || {};

	const lastPromiseSuccessTime = React.useRef<number | null>(null);
	const timeoutId = React.useRef<number>(-1);

	function clearTimeout(): void {
		// Stop all tracking until we get success again.
		window.clearTimeout(timeoutId.current);
		timeoutId.current = -1;
	};

	React.useEffect(() => {
		// If using local data, no need to track here.
		if (!run) {
			return;
		}

		function onVisibilityChange() {
			if (document.hidden) {
				// Stop tracking, because we will use the time variable instead.
				clearTimeout();
			}
			else {
				const lastTime = lastPromiseSuccessTime.current;
				if (!lastTime) {
					return;
				}

				// Check our time. Add a little bit of buffer time.
				const now = Date.now();
				const timeElapsed = now - lastTime;
				const timeRemaining = Math.max(CONSTANT.dataRefreshTimeout - timeElapsed, CONSTANT.dataRefreshVisibilityBuffer);
				if (timeRemaining <= 0) {
					run!(false);
				}
				else {
					clearTimeout();
					timeoutId.current = window.setTimeout(() => {
						run!(false);
					}, timeRemaining);
				}
			}
		}

		document.addEventListener('visibilitychange', onVisibilityChange);

		return () => {
			document.removeEventListener('visibilitychange', onVisibilityChange);
		};
	}, [run]);

	React.useEffect(() => {
		if (isRunning || error || !data || !run) {
			clearTimeout();
			lastPromiseSuccessTime.current = null;
			return;
		}

		clearTimeout();
		// Start tracking.
		lastPromiseSuccessTime.current = Date.now();
		timeoutId.current = window.setTimeout(() => {
			run!(false);
		}, CONSTANT.dataRefreshTimeout);

	}, [isRunning, error, data, promiseFunc, run]);
};




