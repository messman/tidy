import * as React from 'react';
import { createContextConsumer } from '@messman/react-common';
import * as iso from '@wbtdevlocal/iso';
import { CONSTANT } from '../constant';
import { useSafeTimer } from '../lifecycle/timer';
import { RequestResultError } from '../network/request';
import { useApiRequest } from '../network/request-hook';

const [BatchLatestResponseContextProvider, useBatchLatestResponseContext] = createContextConsumer<BatchLatestResponseOutput>(null!);

export const useBatchLatestResponse = useBatchLatestResponseContext;

export interface BatchLatestResponseState {
	isLoading: boolean;
	error: RequestResultError | null;
	success: iso.Batch.LatestAPI.Batch.Latest.Response | null;
}

export interface BatchLatestResponseOutput extends BatchLatestResponseState {
	restart: () => void;
}

export const BatchLatestResponseProvider: React.FC = (props) => {

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

	const { start } = useApiRequest(iso.apiRoutes.batch.latest, (result) => {
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
	});

	const makeRequest = React.useCallback(() => {
		start({ body: null, path: null, query: null }, {
			min: CONSTANT.fetchMinTimeout,
			max: CONSTANT.fetchMaxTimeout
		});

		setState((p) => {
			return {
				...p,
				isLoading: true,
			};
		});
	}, []);


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
		<BatchLatestResponseContextProvider value={value}>
			{props.children}
		</BatchLatestResponseContextProvider>
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