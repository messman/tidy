import * as React from 'react';
import { deserialize, AllResponse, Info, AllResponseData } from 'tidy-shared';
import { DEFINE } from '@/services/define';
import { PromiseState, usePromise, clampPromise } from '../promise';
import { CONSTANT } from '../constant';

export interface AllResponseSuccess extends AllResponse {
	/** Info about the request. */
	info: Info,
	/** Error information about the request. Null if no errors. */
	error: null,
	/** Success information - the response data. Null if errors.  */
	all: AllResponseData
}

const AllResponseContext = React.createContext<PromiseState<AllResponseSuccess>>(null!);

export const AllResponseProvider: React.FC = (props) => {

	let promiseFunc: () => Promise<AllResponse> = fetchAllResponse;
	let minTimeout: number = CONSTANT.fetchMinTimeout;

	// Check whether we will be getting local data or fetch data.
	if (DEFINE.localTestData) {
		promiseFunc = async () => { return DEFINE.localTestData!; };
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
	}

	const clampedPromiseFunc = () => {
		return clampPromise(errorWrappedPromiseFunc(), minTimeout, CONSTANT.fetchMaxTimeout);
	}

	const promiseState = usePromise({
		promiseFunc: clampedPromiseFunc,
		runImmediately: true
	});

	return (
		<AllResponseContext.Provider value={promiseState}>
			{props.children}
		</AllResponseContext.Provider>
	);
}

export const useAllResponse = () => React.useContext(AllResponseContext);

export function hasAllResponseData(allResponsePromise: PromiseState<AllResponse>): boolean {
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


