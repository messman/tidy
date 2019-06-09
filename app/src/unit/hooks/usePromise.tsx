import { useState, useRef } from "react";

export interface PromiseState<T> {
	isLoading: boolean,
	success: T,
	error: Error
}

export function usePromise<T>(promiseFunc: () => Promise<T>): PromiseState<T> {
	const [state, setState] = useState<PromiseState<T>>({
		isLoading: true,
		success: null,
		error: null
	});

	const isFirstRun = useRef(true);

	if (isFirstRun.current) {
		isFirstRun.current = false;
		promiseFunc()
			.then((resp) => {
				setState({
					isLoading: false,
					success: resp,
					error: null,
				});
			})
			.catch((err: Error) => {
				setState({
					isLoading: false,
					success: null,
					error: err
				});
			});
	}
	return state;
}