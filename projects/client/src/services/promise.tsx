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
	promiseFunc: () => Promise<T>,
	isRunning: boolean,
	data: T | null,
	error: Error | null,
}

export interface PromiseOutput<T> extends PromiseState<T> {
	/** Stops if running. */
	stop: (clear: boolean) => void,
	/** Runs, stopping first if running. */
	run: (clear: boolean) => void,
	/** Resets, allowing for a new promise function to be used. */
	reset: (input: PromiseInput<T>, clear: boolean) => void
}

/** Wraps a promise call with a minimum timeout for smooth user experience. */
export function usePromise<T>(input: PromiseInput<T> | (() => PromiseInput<T>)): PromiseOutput<T> {
	const [state, setState] = React.useState<PromiseState<T>>(() => {
		const actualInput = input instanceof Function ? input() : input;

		return {
			promiseFunc: actualInput.promiseFunc,
			isRunning: actualInput.runImmediately,
			data: null,
			error: null
		}
	});

	// Hold our current promise as a way to guard against older promises that complete for newer promises.
	const currentPromise = React.useRef<Promise<T> | null>(null);

	React.useEffect(() => {
		return () => {
			currentPromise.current = null;
		}
	}, []);

	function runPromise(): void {
		function wrapFinish(data: T | null, error: Error | null): void {
			// If this is from an old promise, disregard.
			if (currentPromise.current !== promise) {
				return;
			}
			setState({
				promiseFunc: state.promiseFunc,
				isRunning: false,
				data: data,
				error: error
			});
		}

		const promise = state.promiseFunc();
		currentPromise.current = promise;
		promise
			.then((resp) => {
				wrapFinish(resp, null);
			})
			.catch((err: Error) => {
				wrapFinish(null, err);
			});
	}

	// Run the first time if told to do so.
	// This also controls running after a state update.
	const runFirstTime = React.useRef(state.isRunning);
	if (runFirstTime.current) {
		runFirstTime.current = false;
		runPromise();
	}

	function updateState(newPromiseFunc: (() => Promise<T>) | null, newIsRunning: boolean, clear: boolean): void {
		currentPromise.current = null;
		runFirstTime.current = newIsRunning;
		setState((p) => {
			return {
				promiseFunc: newPromiseFunc || p.promiseFunc,
				isRunning: newIsRunning,
				data: clear ? null : p.data,
				error: clear ? null : p.error
			};
		});
	}

	// Runs, which might override an existing promise.
	function run(clear: boolean): void {
		updateState(null, true, clear);
	}

	// Stops.
	function stop(clear: boolean): void {
		updateState(null, false, clear);
	}

	// Resets the promise hook in order to use a new promise function.
	function reset(newInput: PromiseInput<T>, clear: boolean): void {
		updateState(newInput.promiseFunc, newInput.runImmediately, clear);
	}

	return {
		...state,
		stop: stop,
		run: run,
		reset: reset
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