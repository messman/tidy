import * as React from 'react';
import { createContextConsumer } from '@messman/react-common';
import * as iso from '@wbtdevlocal/iso';
import { CONSTANT } from '../constant';
import { useSafeTimer } from '../lifecycle/timer';
import { RequestResult, RequestResultError } from '../network/request';
import { ApiRequestOptions, useApiRequest } from '../network/request-hook';
import { useDataSeed } from './data-seed';

const [BatchResponseContextProvider, useBatchResponseContext] = createContextConsumer<BatchResponseOutput>(null!);

export const useBatchResponse = useBatchResponseContext;

export interface BatchResponseState {
	isLoading: boolean;
	error: RequestResultError | null;
	success: iso.Batch.BatchContent | null;
}

export interface BatchResponseOutput extends BatchResponseState {
	restart: () => void;
}

export const BatchResponseProvider: React.FC<React.PropsWithChildren> = (props) => {

	const [seed] = useDataSeed();

	const [state, setState] = React.useState<BatchResponseState>(() => {
		return {
			isLoading: false,
			error: null,
			success: null
		};
	});

	const { change } = useSafeTimer(() => {
		makeRequest();
	});

	function onResult(result: RequestResult<iso.Batch.LatestAPI.ApiRouteBatchLatest.ResponseInner | iso.Batch.SeedAPI.ApiRouteBatchSeed.ResponseInner>) {
		if (!result.isSuccess) {
			// Error handling
			setState({
				isLoading: false,
				error: result,
				success: null
			});

			// Stop timer for refresh
			change(null);
			return;
		}

		setState({
			isLoading: false,
			error: null,
			success: result.data.batch
		});

		// Start timer for refresh
		change(CONSTANT.appRefreshTimeout);
	}

	const { start: startLatest } = useApiRequest(iso.apiRoutes.batch.latest, onResult);
	const { start: startSeed } = useApiRequest(iso.apiRoutes.batch.seed, onResult);

	const makeRequest = React.useCallback(() => {
		const requestOptions: ApiRequestOptions = {
			min: CONSTANT.fetchMinTimeout,
			max: CONSTANT.fetchMaxTimeout
		};

		if (seed) {
			startSeed({ body: null, path: { seed: seed }, query: null }, requestOptions);
		}
		else {
			startLatest({ body: null, path: null, query: null }, requestOptions);
		}

		setState((p) => {
			return {
				...p,
				isLoading: true,
			};
		});
	}, [seed]);

	// Start it immediately or after any seed change.
	React.useEffect(() => {
		makeRequest();
	}, [seed]);

	const value = React.useMemo<BatchResponseOutput>(() => {
		return {
			...state,
			restart: makeRequest
		};
	}, [state, makeRequest]);



	// const [currentPromiseLocalDataPhrase, setCurrentPromiseLocalDataPhrase] = React.useState(localDataPhrase);

	// const promiseFunc = React.useMemo(() => {
	// 	return createPromiseFunc(localDataPhrase);
	// }, [localDataPhrase]);

	// const promiseTimer: StalePromiseTimerOutput<iso.Batch.LatestAPI.Batch.Latest.Response> = useStalePromiseTimer({
	// 	initialAction: StalePromiseTimerComponent.promise,
	// 	timerTimeout: CONSTANT.appRefreshTimeout,
	// 	isTimerTruthy: documentVisibility,
	// 	promiseFunc: promiseFunc,
	// });

	// const { timer, promise, lastCompleted } = promiseTimer;

	// React.useEffect(() => {
	// 	if (localDataPhrase !== currentPromiseLocalDataPhrase) {
	// 		setCurrentPromiseLocalDataPhrase(localDataPhrase);

	// 		// Reset
	// 		const keepDataAndError = CONSTANT.clearDataOnNewFetch ? null : undefined;

	// 		// Stop the timer, start the promise.
	// 		if (timer.isStarted) {
	// 			timer.reset({
	// 				isStarted: false
	// 			});
	// 		}
	// 		promise.reset({
	// 			isStarted: true,
	// 			promiseFunc: createPromiseFunc(localDataPhrase),
	// 			data: keepDataAndError,
	// 			error: keepDataAndError
	// 		});
	// 	}
	// 	else if (!timer.isStarted && !promise.isStarted) {
	// 		if (lastCompleted === StalePromiseTimerComponent.timer) {
	// 			window.location.reload();
	// 		}
	// 		else if (!localDataPhrase) {
	// 			timer.reset({
	// 				isStarted: true
	// 			});
	// 		}
	// 	}
	// }, [promise, timer, lastCompleted, localDataPhrase, promiseFunc]);

	return (
		<BatchResponseContextProvider value={value}>
			{props.children}
		</BatchResponseContextProvider>
	);
};

// function createPromiseFunc(localDataPhrase: string | null): () => Promise<BatchLatestResponseSuccess> {
// 	let promiseFunc: () => Promise<BatchLatestResponse> = fetchBatchLatestResponse;
// 	let minTimeout: number = CONSTANT.fetchMinTimeout;

// 	if (localDataPhrase) {
// 		const localData = DEFINE.localTestData![localDataPhrase];
// 		promiseFunc = async () => { return localData; };
// 		minTimeout = CONSTANT.localTestDataMinTimeout;
// 	}

// 	const errorWrappedPromiseFunc = async (): Promise<BatchLatestResponseSuccess> => {
// 		try {
// 			const result = await promiseFunc();
// 			if (result.error) {
// 				// Log errors coming in from the API.
// 				console.error('Errors received from successful fetch', result.error.errors);
// 				throw new Error('Errors received from result of fetch');
// 			}
// 			return {
// 				info: result.info,
// 				BatchLatest: result.BatchLatest!,
// 				error: null
// 			};
// 		}
// 		catch (e) {
// 			console.error(e);
// 			throw e;
// 		}
// 	};

// 	return () => {
// 		return clampPromise(errorWrappedPromiseFunc(), minTimeout, CONSTANT.fetchMaxTimeout);
// 	};
// }