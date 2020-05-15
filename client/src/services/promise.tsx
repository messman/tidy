import * as React from 'react';

export interface PromiseInput<T> {
	promiseFunc: () => Promise<T>,
	runImmediately: boolean
}

export enum PromiseErrorReason {
	promise,
	maximum,
}

export interface PromiseState<T> {
	isRunning: boolean,
	data: T | null,
	error: Error | null,
}

export interface PromiseOutput<T> extends PromiseState<T> {
	/** Stops if running. */
	stop: (clear: boolean) => void,
	/** Runs, stopping first if running. */
	run: (clear: boolean) => void,
}

/** Wraps a promise call with a minimum timeout for smooth user experience. */
export function usePromise<T>(input: PromiseInput<T>): PromiseOutput<T> {
	const [state, setState] = React.useState<PromiseState<T>>(() => {
		console.log('Initial Args', input);
		return {
			isRunning: input.runImmediately,
			data: null,
			error: null
		}
	});

	// Hold our current promise as a way to guard against older promises that complete for newer promises.
	const currentPromise = React.useRef<Promise<T> | null>(null);

	React.useEffect(() => {
		return () => {
			console.log('Cleaning Up');
			currentPromise.current = null;
		}
	}, []);

	function runPromise(): void {
		function wrapFinish(data: T | null, error: Error | null): void {
			console.log('Finishing Promise');
			// If this is from an old promise, disregard.
			if (currentPromise.current !== promise) {
				console.log('Mismatch Promise');
				return;
			}
			setState({
				isRunning: false,
				data: data,
				error: error
			});
		}

		console.log('Running promise');
		const promise = input.promiseFunc();
		currentPromise.current = promise;
		promise
			.then((resp) => {
				wrapFinish(resp, null);
			})
			.catch((err: Error) => {
				wrapFinish(null, err);
			});
	}

	function updateState(newIsRunning: boolean, clear: boolean): void {
		// If we are clearing, clear the data and error.
		// Else, just set the running state.
		if (clear) {
			// If we are clearing, we will always discard a currently-running promise.
			currentPromise.current = null;

			setState((p) => {
				// If we are already running or not running and have no data, nothing has changed.
				if (p.isRunning === newIsRunning && !p.data && !p.error) {
					return p;
				}

				// Else, set the new state object.
				return {
					isRunning: newIsRunning,
					data: null,
					error: null,
				}
			});
		}
		else {
			setState((p) => {
				// If we're still supposed to be running/not running, nothing has changed.
				if (p.isRunning === newIsRunning) {
					return p;
				}

				// Else, clear our currently-running promise.
				currentPromise.current = null;

				// Keep whatever data we had before.
				return {
					isRunning: newIsRunning,
					data: p.data,
					error: p.error,
				}
			});
		}
	}

	// Run the first time if told to do so.
	const runFirstTime = React.useRef(input.runImmediately);
	if (runFirstTime.current) {
		runFirstTime.current = false;
		runPromise();
	}

	// Runs, which might override an existing promise.
	function run(clear: boolean): void {
		updateState(true, clear);
		runPromise();
	}

	// Stops.
	function stop(clear: boolean): void {
		updateState(false, clear);
	}

	return {
		...state,
		stop: stop,
		run: run
	};
}

export const clampPromiseMaximumTimeoutReason = '__promise-timed-out__';

/** Times out a promise. */
export function clampPromise<T>(promise: Promise<T>, minMilliseconds: number | null, maxMilliseconds: number | null): Promise<T> {

	return new Promise<T>((resolve, reject) => {

		const startTime = Date.now();
		let didReachMaximum = false;
		let timeoutId = -1;
		if (maxMilliseconds != null) {
			timeoutId = window.setTimeout(() => {
				didReachMaximum = true;
				reject(new Error(clampPromiseMaximumTimeoutReason));
			}, maxMilliseconds);
		}

		function onFinish(res: T | null, err: any | null): void {
			if (didReachMaximum) {
				return;
			}

			if (timeoutId !== -1) {
				window.clearTimeout(timeoutId);
			}

			// Apply our minimum time.
			const minTimeRemaining = Math.max(0, (minMilliseconds || 0) - (Date.now() - startTime));

			function finish(): void {
				if (res) {
					resolve(res);
				}
				else {
					reject(err);
				}
			}

			if (minTimeRemaining > 0) {
				window.setTimeout(finish, minTimeRemaining);
			}
			else {
				finish();
			}
		}

		promise.then(
			(res) => {
				onFinish(res, null);
			},
			(err) => {
				onFinish(null, err);
			}
		);
	})
}