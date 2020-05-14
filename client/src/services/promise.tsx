import * as React from 'react';

// export interface PromiseState<T> {
// 	isStarted: boolean,
// 	success: T,
// 	error: Error
// }

// export function usePromise1<T>(promiseFunc: () => Promise<T>): PromiseState<T> {
// 	const [state, setState] = useState<PromiseState<T>>({
// 		isLoading: true,
// 		success: null!,
// 		error: null!
// 	});

// 	const isFirstRun = useRef(true);

// 	if (isFirstRun.current) {
// 		isFirstRun.current = false;
// 		promiseFunc()
// 			.then((resp) => {
// 				setState({
// 					isLoading: false,
// 					success: resp,
// 					error: null!,
// 				});
// 			})
// 			.catch((err: Error) => {
// 				setState({
// 					isLoading: false,
// 					success: null!,
// 					error: err
// 				});
// 			});
// 	}
// 	return state;
// }

// function timeoutPromise<S>(val: S, pass: boolean, timeout: number): Promise<S> {
// 	return new Promise((res, rej) => {
// 		setTimeout(() => {
// 			if (pass)
// 				res(val);
// 			else
// 				rej(val);
// 		}, timeout);
// 	});
// }

// // Delays a promise, including its error.
// export function wrapPromise<T>(promise: Promise<T>, time: number): Promise<T> {
// 	const now = Date.now();
// 	function on(pass


// 	return promise
// 		.then((val) => {
// 			const diff = Date.now() - now;
// 			if (diff < time)
// 				return timeoutPromise(val, true, time - diff);
// 			else
// 				return val;
// 		})
// 		.catch((err) => {
// 			const diff = Date.now() - now;
// 			if (diff < time)
// 				return timeoutPromise(err, false, time - diff);
// 			else
// 				return err;
// 		});
// }

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
	const [state, setState] = React.useState<PromiseState<T>>({
		isRunning: input.runImmediately,
		data: null,
		error: null
	});

	// Hold our current promise as a way to guard against older promises that complete for newer promises.
	const currentPromise = React.useRef<Promise<T> | null>(null);

	function runPromise(): void {
		function wrapFinish(success: T | null, error: Error | null): void {
			// If this is from an old promise, disregard.
			if (currentPromise.current !== promise) {
				return;
			}
			setState({
				isRunning: false,
				data: success,
				error: error
			});
		}

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

	function updateState(isRunning: boolean, clear: boolean): void {
		// If we are clearing, clear the data and error.
		// Else, just set the running state.
		if (clear) {
			currentPromise.current = null;
			setState((p) => {
				if (p.isRunning === isRunning && !p.data && !p.error) {
					return p;
				}
				return {
					isRunning: isRunning,
					data: null,
					error: null,
				}
			});
		}
		else {
			setState((p) => {
				if (p.isRunning === isRunning) {
					return p;
				}
				return {
					...p,
					isRunning: isRunning
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


// /** Times out a promise. */
// export function promiseMaximum<T>(promise: Promise<T>, maxMilliseconds: number): Promise<T> {
// 	return new Promise<T>((resolve, reject) => {
// 		let didTimeOut = false;
// 		const timeoutId = setTimeout(() => {
// 			didTimeOut = true;
// 			reject(new Error("timed out at maximum"));
// 		}, maxMilliseconds);
// 		promise.then(
// 			(res) => {
// 				if (!didTimeOut) {
// 					clearTimeout(timeoutId);
// 					resolve(res);
// 				}
// 			},
// 			(err) => {
// 				if (!didTimeOut) {
// 					clearTimeout(timeoutId);
// 					reject(err);
// 				}
// 			}
// 		);
// 	})
// }

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