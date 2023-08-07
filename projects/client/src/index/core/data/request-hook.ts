import * as React from 'react';
import { useEventCallback } from '@messman/react-common';
import { ApiRoute, ApiRouteRequest, RequestOf, ResponseInnerOf } from '@wbtdevlocal/iso';
import { ClientErrorForm, makeApiRequest, RequestOptions, RequestResult } from './request';
import { useRequestFetch } from './request-fetch-provider';

/** A request options interface that does not require an AbortController instance or fetch function, as they will be provided within the hook. */
export interface ApiRequestOptions extends Omit<RequestOptions, 'abortController' | 'fetchFunc'> {

}

export interface ApiRequestOutput<TRequest extends ApiRouteRequest> {
	/**
	 * Starts a request to the given API route. 
	 */
	start: (input: TRequest, options: ApiRequestOptions) => void;
	/**
	 * Aborts the request, if any. Does not throw.
	 */
	abort: () => void;
}

/**
 * Returns functions that make or abort requests to the API (only).
 * @param route - The route that will be accessed. This route should not change for the life of the component.
 */
export function useApiRequest<TApiRoute extends ApiRoute>(route: TApiRoute, callback: (result: RequestResult<ResponseInnerOf<TApiRoute>>) => void): ApiRequestOutput<RequestOf<TApiRoute>> {

	const { createFetchFunc } = useRequestFetch();

	// Track the abortController used here so we can abort the request.
	const abortControllerRef = React.useRef<AbortController | null>(null);

	const triggerCallback = useEventCallback(callback);

	const abort = React.useCallback(() => {
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
			abortControllerRef.current = null;
		}
	}, []);

	React.useEffect(() => {
		return () => {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
				abortControllerRef.current = null;
			}
		};
	}, []);

	return React.useMemo<ApiRequestOutput<RequestOf<TApiRoute>>>(() => {
		return {
			start: (input, options) => {
				// End any existing request.
				abort();

				// Create the new abort controller.
				abortControllerRef.current = new AbortController();

				const fetchFunc = createFetchFunc(route, input);

				// Start.
				makeApiRequest(route, input, {
					...options,
					abortController: abortControllerRef.current,
					fetchFunc: fetchFunc
				})
					.then((result) => {
						// If we aborted, no callback.
						const isAbortError = result.clientError?.form === ClientErrorForm.aborted;
						if (abortControllerRef.current && !isAbortError) {
							triggerCallback(result);
						}
					})
					.catch((error) => {
						// This shouldn't ever happen because neither request method should throw.
						console.error('useApiRequest - error', error);
					});
			},
			abort
		};
	}, [triggerCallback, createFetchFunc, abort]);
}

const defaultClampMax = 10000;
const defaultClampMin = 200;

export const RequestTiming = {
	instant: { min: 0, max: defaultClampMax },
	slowed: { min: defaultClampMin, max: defaultClampMax },
};