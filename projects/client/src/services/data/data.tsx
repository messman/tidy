import * as React from 'react';
import { createContextConsumer } from '@messman/react-common';
import * as iso from '@wbtdevlocal/iso';
import { CONSTANT } from '../constant';
import { useSafeTimer } from '../lifecycle/timer';
import { RequestResult, RequestResultError } from '../network/request';
import { ApiRequestOptions, useApiRequest } from '../network/request-hook';
import { useDataSeed } from './data-seed';

const [BatchContentContextProvider, useBatchContentContext] = createContextConsumer<BatchLatestResponseOutput>(null!);

export const useBatchContent = useBatchContentContext;

export interface BatchLatestResponseState {
	isLoading: boolean;
	error: RequestResultError | null;
	success: iso.Batch.BatchContent | null;
}

export interface BatchLatestResponseOutput extends BatchLatestResponseState {
	restart: () => void;
}

export const BatchLatestResponseProvider: React.FC = (props) => {

	const [seed] = useDataSeed();

	const [state, setState] = React.useState<BatchLatestResponseState>(() => {
		return {
			isLoading: false,
			error: null,
			success: null
		};
	});

	const { change } = useSafeTimer(() => {
		makeRequest();
	});

	function onResult(result: RequestResult<iso.Batch.LatestAPI.Read.Response | iso.Batch.SeedAPI.Read.Response>) {
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
			success: result.data
		});

		// Start timer for refresh
		change(CONSTANT.appRefreshTimeout);
	}

	const { start: startLatest } = useApiRequest(iso.apiRoutes.batch.latest.read, onResult);
	const { start: startSeed } = useApiRequest(iso.apiRoutes.batch.seed.read, onResult);

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


	const value = React.useMemo<BatchLatestResponseOutput>(() => {
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
		<BatchContentContextProvider value={value}>
			{props.children}
		</BatchContentContextProvider>
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