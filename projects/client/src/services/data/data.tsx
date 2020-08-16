import * as React from 'react';
import { AllResponse, AllResponseData, deserialize, Info } from 'tidy-shared';
import { DEFINE } from '@/services/define';
import { clampPromise, PromiseOutput, StalePromiseTimerComponent, StalePromiseTimerOutput, useDocumentVisibility, useRenderDebug, useStalePromiseTimer } from '@messman/react-common';
import { CONSTANT } from '../constant';
import { useLocalDataPhrase } from './data-local';

export interface AllResponseSuccess extends AllResponse {
	/** Info about the request. */
	info: Info,
	/** Error information about the request. Null if no errors. */
	error: null,
	/** Success information - the response data. Null if errors.  */
	all: AllResponseData;
}

const AllResponseContext = React.createContext<PromiseOutput<AllResponseSuccess>>(null!);

export const AllResponseProvider: React.FC = (props) => {

	const documentVisibility = useDocumentVisibility();
	const [localDataPhrase] = useLocalDataPhrase();

	const [currentPromiseLocalDataPhrase, setCurrentPromiseLocalDataPhrase] = React.useState(localDataPhrase);

	const promiseFunc = React.useMemo(() => {
		return createPromiseFunc(localDataPhrase);
	}, [localDataPhrase]);

	const promiseTimer: StalePromiseTimerOutput<AllResponseSuccess> = useStalePromiseTimer({
		initialAction: StalePromiseTimerComponent.promise,
		timerTimeout: CONSTANT.dataRefreshTimeout,
		isTimerTruthy: documentVisibility,
		timerCallback: () => {
			console.log('TIMER DONE');
		},
		promiseFunc: promiseFunc,
	});

	const { timer, promise, lastCompleted } = promiseTimer;

	useRenderDebug('Data', { timer, promise, lastCompleted, localDataPhrase });

	React.useEffect(() => {
		if (localDataPhrase !== currentPromiseLocalDataPhrase) {
			setCurrentPromiseLocalDataPhrase(localDataPhrase);

			// Reset
			const keepDataAndError = CONSTANT.clearDataOnNewFetch ? null : undefined;

			// Stop the timer, start the promise.
			if (timer.isStarted) {
				timer.reset({
					isStarted: false
				});
			}
			promise.reset({
				isStarted: true,
				promiseFunc: createPromiseFunc(localDataPhrase),
				data: keepDataAndError,
				error: keepDataAndError
			});
		}
		else if (!timer.isStarted && !promise.isStarted) {
			if (lastCompleted === StalePromiseTimerComponent.timer) {
				window.location.reload();
			}
			else if (!localDataPhrase) {
				timer.reset({
					isStarted: true
				});
			}
		}
	}, [promise, timer, lastCompleted, localDataPhrase, promiseFunc]);

	return (
		<AllResponseContext.Provider value={promiseTimer.promise}>
			{props.children}
		</AllResponseContext.Provider>
	);
};

function createPromiseFunc(localDataPhrase: string | null): () => Promise<AllResponseSuccess> {
	let promiseFunc: () => Promise<AllResponse> = fetchAllResponse;
	let minTimeout: number = CONSTANT.fetchMinTimeout;

	if (localDataPhrase) {
		const localData = DEFINE.localTestData![localDataPhrase];
		promiseFunc = async () => { return localData; };
		minTimeout = CONSTANT.localTestDataMinTimeout;
	}

	const errorWrappedPromiseFunc = async (): Promise<AllResponseSuccess> => {
		try {
			const result = await promiseFunc();
			if (result.error) {
				// Log errors coming in from the API.
				console.error('Errors received from successful fetch', result.error.errors);
				throw new Error('Errors received from result of fetch');
			}
			return {
				info: result.info,
				all: result.all!,
				error: null
			};
		}
		catch (e) {
			console.error(e);
			throw e;
		}
	};

	return () => {
		return clampPromise(errorWrappedPromiseFunc(), minTimeout, CONSTANT.fetchMaxTimeout);
	};
}

export const useAllResponse = () => React.useContext(AllResponseContext);

export function hasAllResponseData(allResponsePromise: PromiseOutput<AllResponseSuccess>): boolean {
	return !!allResponsePromise?.data?.all;
}

async function fetchAllResponse(): Promise<AllResponse> {

	const url = DEFINE.fetchUrl;

	try {
		const response = await fetch(url);
		if (response.ok) {
			try {
				const text = await response.text();
				return deserialize(text);
			}
			catch (e) {
				console.error(e);
				throw new Error('Fetch was successful, but there was a problem with deserialization.');
			}
		}
		else {
			if (response.status === 404) {
				throw new Error('The application could not connect to the API (404)');
			}
			throw new Error(`The API experienced an error (${response.status})`);
		}
	}
	catch (err) {
		if (!(err instanceof Error)) {
			err = new Error(err);
		}
		console.error(url, err);
		throw err;
	}
}


