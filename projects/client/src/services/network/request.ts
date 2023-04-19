import * as iso from '@wbtdevlocal/iso';
import { DEFINE } from '../define';

export interface RequestResultPathInfo {
	/** After replacements / insertions / params. */
	finalUrl: string;
	method: iso.HttpMethod;
}

export interface RequestResultSuccess<TResponseInner extends iso.ApiRouteResponseInner> {
	isSuccess: true;
	pathInfo: RequestResultPathInfo;
	data: TResponseInner;
	clientError: null;
	serverError: null;
}

export interface RequestResultClientError {
	isSuccess: false;
	pathInfo: RequestResultPathInfo;
	data: null;
	clientError: ClientError;
	serverError: null;
}

export interface RequestResultServerError {
	isSuccess: false;
	pathInfo: RequestResultPathInfo;
	data: null;
	clientError: null;
	serverError: iso.ServerError;
}

export type RequestResultError = RequestResultClientError | RequestResultServerError;

export type RequestResult<TResponseInner extends iso.ApiRouteResponseInner> = RequestResultSuccess<TResponseInner> | RequestResultError;

export function isRequestResultError(obj: any): obj is RequestResultError {
	return !!obj && obj['isSuccess'] === false && obj['pathInfo'] !== undefined && obj['data'] === null;
}

export enum ClientErrorForm {
	/** Error trying to get the request ready - checking params, etc. */
	packRequest = 1,
	/** Timeout. */
	fetchTimeout = 2,
	/** Network issue. */
	networkIssue = 3,
	/** Parsing results. */
	parseResult = 4,
	/** Aborted (likely discarded). */
	aborted = 5,
}

export interface ClientError {
	form: ClientErrorForm;
	error: Error | null;
}

export function createClientRequestResultError<TResponseInner extends iso.ApiRouteResponseInner>(pathInfo: RequestResultPathInfo, form: ClientErrorForm, error: Error | null): RequestResult<TResponseInner> {
	const result: RequestResultClientError = {
		pathInfo,
		isSuccess: false,
		data: null,
		clientError: {
			form: form,
			error: error
		},
		serverError: null
	};
	console.error(result, error);
	return result;
}

export const globalMaximumRequestTimeout = 25_000;

export type FetchFunc = (url: string, init: RequestInit) => Promise<Response>;

export interface RequestOptions {
	fetchFunc: FetchFunc;
	/** If not passed, the request cannot be aborted. */
	abortController: AbortController;
	/** Default: 0. */
	min: number | null;
	/** Default: global maximum. The minimum of any provided value and the global maximum will be used. */
	max: number | null;
}

/**
 * Makes a request to the API (only). 
 * Only accepts JSON. 
 * Never throws. Always returns a result object that will
 * contain an error, if any.
 */
export async function makeApiRequest<TApiRoute extends iso.ApiRoute = iso.ApiRoute>(route: TApiRoute, input: iso.OptionalRequestOf<TApiRoute>, options: RequestOptions): Promise<RequestResult<iso.ResponseInnerOf<TApiRoute>>> {

	// Path may actually be null if we are attempting a development path in production.
	if (!route || !route.path) {
		return createClientRequestResultError<iso.ResponseInnerOf<TApiRoute>>({ finalUrl: '', method: iso.HttpMethod.GET }, ClientErrorForm.packRequest, new Error('Request path is empty'));
	}

	const headers: Record<string, string> = {
		'Content-Type': 'application/json'
	};

	let path = route.path;
	let requestBody: iso.ApiRouteRequestBody = null;
	let pathParamsError: Error | null = null;

	if (input) {
		const { body, path: pathParams, query: queryParams } = input as iso.ApiRouteRequest;
		requestBody = body as {} | null;

		if (pathParams) {
			const keys = Object.keys(pathParams);
			for (let i = 0; i < keys.length; i++) {
				const key = keys[i];
				const value = pathParams[key as keyof typeof pathParams] as any;
				/*
					TODO:
					As of right now, we don't support optional parameters, and we want to fail fast here
					to prevent weird behaviors based on arbitrary parameters.
					But maybe we'll need to be less strict than this...
				*/
				if (!value) {
					pathParamsError = new Error('Path parameter is malformed');
					break;
				}
				const oldPath = path;
				path = path.replace('/:' + key, '/' + value.toString());
				if (path === oldPath) {
					pathParamsError = new Error('Path parameter caused no transformation');
					break;
				}
			}
			if (!pathParamsError && path.indexOf(':') !== -1) {
				pathParamsError = new Error('Path parameter is missing');
			}
		}

		if (queryParams) {
			// URLSearchParams does not remove 'undefined' or 'null' on its own. We need to do that
			// (but keep other falsy values).
			const cleanedQueryParams = {} as Record<string, string>;
			Object.keys(queryParams).forEach((key) => {
				const value = queryParams[key as keyof typeof queryParams];
				if (value !== undefined && value !== null) {
					cleanedQueryParams[key] = iso.serializeForPathOrQuery(value); // #REF_API_DATE_SERIALIZATION
				}
			});
			const params = new URLSearchParams(cleanedQueryParams as Record<string, string>);
			const asString = params.toString();
			if (asString) {
				path += '?' + asString;
			}
		}
	}

	// apiRoot is similar to "/api", path is like "/batch"
	const url = `${DEFINE.apiRoot}${path}`;
	const pathInfo: RequestResultPathInfo = {
		finalUrl: url,
		method: route.method
	};

	if (pathParamsError) {
		return createClientRequestResultError<iso.ResponseInnerOf<TApiRoute>>(pathInfo, ClientErrorForm.packRequest, pathParamsError);
	}

	const isGet = route.method === iso.HttpMethod.GET;
	const hasRequestBody = requestBody && (Object.keys(requestBody).length !== 0);
	if (isGet && hasRequestBody) {
		return createClientRequestResultError<iso.ResponseInnerOf<TApiRoute>>(pathInfo, ClientErrorForm.packRequest, new Error(`Method '${route.method}' cannot include a body`));
	}

	/*
		Up ahead we will start our request.
		We support a minimum timeout (useful for UI) and a maximum timeout (because browsers are inconsistent and we want a lower timeout).
		We use AbortController for aborting the request because it actually stops the request from taking further resources.
	*/
	// Used to track whether the abort came from our internal timer.
	let isManualTimeout = false;
	const { fetchFunc, abortController } = options;
	// We always have a max timeout, but it can be customized to a lower value.
	const max = options.max ? Math.min(options.max, globalMaximumRequestTimeout) : globalMaximumRequestTimeout;
	const min = options.min || 0;
	let response: Response = null!;
	try {
		response = await new Promise((resolve, reject) => {

			const startTime = Date.now();
			let timeoutId = window.setTimeout(() => {
				// Abort, and remember that we were the cause.
				isManualTimeout = true;
				abortController.abort();
			}, max);

			function onFinish(res: Response | null, err: Error | null): void {
				if (timeoutId !== -1) {
					window.clearTimeout(timeoutId);
				}

				// Apply our minimum time.
				const minTimeRemaining = Math.max(0, min - (Date.now() - startTime));

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

			fetchFunc(url, {
				method: route.method,
				headers: headers,
				body: requestBody ? JSON.stringify(requestBody) : undefined,
				signal: abortController.signal
			})
				.then(
					(res) => {
						onFinish(res, null);
					},
					(err) => {
						onFinish(null, err);
					}
				);

		});
	}
	catch (e) {
		// Three possibilities: manual timeout, aborted outside, or other.
		if (isManualTimeout) {
			return createClientRequestResultError<iso.ResponseInnerOf<TApiRoute>>(pathInfo, ClientErrorForm.fetchTimeout, new Error('Request timed out'));
		}
		else if (abortController.signal.aborted) {
			return createClientRequestResultError<iso.ResponseInnerOf<TApiRoute>>(pathInfo, ClientErrorForm.aborted, new Error('Request was aborted'));
		}
		else {
			return createClientRequestResultError<iso.ResponseInnerOf<TApiRoute>>(pathInfo, ClientErrorForm.networkIssue, e as Error);
		}
	}

	const text = await response.text();

	if (!response.ok && text.startsWith('<')) {
		// If not okay and starts with '<', it's likely HTML being sent back from a proxy (nginx).
		// This is a network issue.
		return createClientRequestResultError(pathInfo, ClientErrorForm.networkIssue, new Error(`${response.status}: ${response.statusText}`));
	}

	let responseBody: iso.ResponseOf<TApiRoute> | void = null!;
	if (text) {
		try {
			/*
				#REF_API_DATE_SERIALIZATION
				As discussed in iso, Dates are serialized to strings and not deserialized back to Dates.
				There is a serialize/deserialize function pair that handles this issue.
			*/
			responseBody = iso.deserialize<iso.ResponseOf<TApiRoute>>(text);
		}
		catch (e) {
			return createClientRequestResultError<iso.ResponseInnerOf<TApiRoute>>(pathInfo, ClientErrorForm.parseResult, e as Error);
		}
	}

	// If 200...
	if (response.ok) {
		return {
			pathInfo,
			isSuccess: true,
			data: responseBody.a as iso.ResponseInnerOf<TApiRoute>,
			clientError: null,
			serverError: null
		};
	}
	// Else, check for an error...
	if (responseBody) {
		if (responseBody._err) {
			return {
				pathInfo,
				isSuccess: false,
				data: null,
				clientError: null,
				serverError: responseBody._err
			};
		}
	}
	// Default, error.
	return createClientRequestResultError<iso.ResponseInnerOf<TApiRoute>>(pathInfo, ClientErrorForm.parseResult, null);
}