import * as React from 'react';
import { createTestServerError } from '@/test/data/test-data-utility';
import { createContextConsumer } from '@messman/react-common';
import * as iso from '@wbtdevlocal/iso';
import { FetchFunc } from './request';
import { RequestFetchContextProvider, RequestFetchProviderOutput } from './request-fetch-provider';

/*
	Code is used to mock the function for sending an API request.
	Function signature should roughly match that function.
*/

export interface MockOnFetchFunc<TRequest extends iso.ApiRouteRequest, TResponse extends iso.ApiRouteResponse> {
	(input: TRequest, route: iso.ApiRoute<TRequest, TResponse>): iso.ServerError | TResponse | false;
}

export const defaultFailureMockFetch: MockOnFetchFunc<any, any> = (_input, _route) => {
	return createTestServerError();
};

export interface MockApiEntry<TRequest extends iso.ApiRouteRequest, TResponse extends iso.ApiRouteResponse> {
	timeout: number;
	onFetch: MockOnFetchFunc<TRequest, TResponse>;
}

export interface MockApiOverrides {
	timeout: number | null;
	response: iso.ServerError | false | null;
}

export interface MockApiOutput {
	setOverrides: (overrides: MockApiOverrides | null) => void;
	getOverrides: () => MockApiOverrides | null;
	set: <TRequest extends iso.ApiRouteRequest, TResponse extends iso.ApiRouteResponse>(route: iso.ApiRoute<TRequest, TResponse>, entry: MockApiEntry<TRequest, TResponse> | null) => void;
	get: <TRequest extends iso.ApiRouteRequest, TResponse extends iso.ApiRouteResponse>(route: iso.ApiRoute<TRequest, TResponse>) => MockApiEntry<TRequest, TResponse> | null;
};

const [MockApiProviderContext, useMockApiContext] = createContextConsumer<MockApiOutput>();
export const useMockApi = useMockApiContext;

type MockApiMap = Map<iso.ApiRoute<any, any>, MockApiEntry<any, any>>;

export const MockApiProvider: React.FC = (props) => {

	const overridesRef = React.useRef<MockApiOverrides | null>(null);
	const mapRef = React.useRef<MockApiMap>(null!);
	if (!mapRef.current) {
		mapRef.current = new Map<iso.ApiRoute<any, any>, MockApiEntry<any, any>>();
	}

	const output = React.useMemo<MockApiOutput>(() => {
		return {
			setOverrides: (overrides) => {
				overridesRef.current = overrides;
			},
			getOverrides: () => {
				return overridesRef.current;
			},
			set: (route, entry) => {
				if (entry) {
					mapRef.current.set(route, entry);
				}
				else if (mapRef.current.has(route)) {
					mapRef.current.delete(route);
				}
			},
			get: (route) => {
				return mapRef.current.get(route) || null;
			}
		};
	}, []);

	return (
		<MockApiProviderContext value={output}>
			<TestRequestProvider>
				{props.children}
			</TestRequestProvider>
		</MockApiProviderContext>
	);
};

const TestRequestProvider: React.FC = (props) => {
	const mockApi = useMockApiContext();

	const value = React.useMemo<RequestFetchProviderOutput>(() => {
		return {
			createFetchFunc: (route, input) => {
				// If we have a mock API, check that our route has a test entry.
				const mockApiEntry = mockApi.get(route);
				if (mockApiEntry) {
					// Use it.
					const { onFetch } = mockApiEntry;
					let mockTimeout = mockApiEntry.timeout;

					let overrideResponse = null;
					const mockApiOverrides = mockApi.getOverrides();
					if (mockApiOverrides) {
						const { response, timeout } = mockApiOverrides;
						if (response !== null) {
							overrideResponse = response;
						}
						if (timeout !== null) {
							mockTimeout = timeout;
						}
					}
					return createMockFetch(route, input, mockTimeout, onFetch, overrideResponse);
				}
				else {
					// Create a failure.
					return createMockFetch(route, input, 0, defaultFailureMockFetch, null);
				}
			}
		};
	}, [mockApi]);

	return (
		<RequestFetchContextProvider value={value}>
			{props.children}
		</RequestFetchContextProvider>
	);
};

function createMockFetch
	<
		TRequest extends iso.ApiRouteRequest,
		TResponse extends iso.ApiRouteResponse,
	>
	(route: iso.ApiRoute<TRequest, TResponse>, input: TRequest, timeout: number, onFetch: MockOnFetchFunc<TRequest, TResponse>, overrideResponse: iso.ServerError | iso.ApiRouteResponse | false | null): FetchFunc {

	return function (_url: string, init: RequestInit) {
		return new Promise((resolve, reject) => {

			let timeoutId = window.setTimeout(() => {
				const response = overrideResponse !== null ? overrideResponse : onFetch(input, route);
				console.log('Mocked Fetch', { path: route.path, response, isGlobalOverride: !!overrideResponse });
				if (response === false) {
					reject(new Error('Mock API - simulated network issue'));
				}
				else if (iso.isServerError(response)) {
					resolve(new Response(asBlob({ _err: response }), { status: 500, statusText: 'mock error' }));
				}
				else {
					resolve(new Response(asBlob(response), { status: 200, statusText: 'mock success' }));
				}
			}, timeout);

			init.signal?.addEventListener("abort", () => {
				window.clearTimeout(timeoutId);
				reject(new Error('Mock API - simulated timeout'));
			});
		});
	};
}

function asBlob(obj: iso.ApiRouteResponse): Blob {
	return new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
}