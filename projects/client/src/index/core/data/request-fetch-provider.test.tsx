import * as React from 'react';
import { createTestServerError } from '@/test/data/test-data-utility';
import { createContextConsumer } from '@messman/react-common';
import { ApiRoute, ApiRouteResponse, isServerError, RequestOf, ResponseOf, ServerError } from '@wbtdevlocal/iso';
import { FetchFunc } from './request';
import { RequestFetchContextProvider, RequestFetchProviderOutput } from './request-fetch-provider';

/*
	Code is used to mock the function for sending an API request.
	Function signature should roughly match that function.
*/

export interface MockOnFetchFunc<TApiRoute extends ApiRoute> {
	(input: RequestOf<TApiRoute>, route: TApiRoute): ServerError | ResponseOf<TApiRoute> | false;
}

export const defaultFailureMockFetch: MockOnFetchFunc<ApiRoute> = (_input, _route) => {
	return createTestServerError();
};

export interface MockApiEntry<TApiRoute extends ApiRoute> {
	timeout: number;
	onFetch: MockOnFetchFunc<TApiRoute>;
}

export interface MockApiOverrides {
	timeout: number | null;
	response: ServerError | false | null;
}

export interface MockApiOutput {
	setOverrides: (overrides: MockApiOverrides | null) => void;
	getOverrides: () => MockApiOverrides | null;
	set: <TApiRoute extends ApiRoute>(route: TApiRoute, entry: MockApiEntry<TApiRoute> | null) => void;
	get: <TApiRoute extends ApiRoute>(route: TApiRoute) => MockApiEntry<TApiRoute> | null;
};

const [MockApiProviderContext, useMockApiContext] = createContextConsumer<MockApiOutput>();
export const useMockApi = useMockApiContext;

type MockApiMap = Map<ApiRoute, MockApiEntry<ApiRoute>>;

export const MockApiProvider: React.FC<React.PropsWithChildren> = (props) => {

	const overridesRef = React.useRef<MockApiOverrides | null>(null);
	const mapRef = React.useRef<MockApiMap>(null!);
	if (!mapRef.current) {
		mapRef.current = new Map<ApiRoute, MockApiEntry<ApiRoute>>();
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
					mapRef.current.set(route, entry as any);
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

const TestRequestProvider: React.FC<React.PropsWithChildren> = (props) => {
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

function createMockFetch<TApiRoute extends ApiRoute>(route: TApiRoute, input: RequestOf<TApiRoute>, timeout: number, onFetch: MockOnFetchFunc<TApiRoute>, overrideResponse: ServerError | ApiRouteResponse | false | null): FetchFunc {

	return function (_url: string, init: RequestInit) {
		return new Promise((resolve, reject) => {

			let timeoutId = window.setTimeout(() => {
				const response = overrideResponse !== null ? overrideResponse : onFetch(input, route);
				console.log('Mocked Fetch', { path: route.path, response, isGlobalOverride: !!overrideResponse });
				if (response === false) {
					reject(new Error('Mock API - simulated network issue'));
				}
				else if (isServerError(response)) {
					resolve(new Response(asBlob({ a: null, _err: response }), { status: 500, statusText: 'mock error' }));
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

function asBlob(obj: ApiRouteResponse): Blob {
	return new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
}