import * as React from 'react';
import { createContextConsumer } from '@messman/react-common';
import * as iso from '@wbtdevlocal/iso';
import { FetchFunc } from './request';

export type CreateFetchFunc = <TRequest extends iso.ApiRouteRequest, TResponse extends iso.ApiRouteResponse>(route: iso.ApiRoute<TRequest, TResponse>, input: TRequest) => FetchFunc;


export interface RequestFetchProviderOutput {
	createFetchFunc: CreateFetchFunc;
}

export const [RequestFetchContextProvider, useRequestFetch] = createContextConsumer<RequestFetchProviderOutput>();

export const RequestFetchProvider: React.FC = (props) => {

	const value = React.useMemo<RequestFetchProviderOutput>(() => {
		return {
			createFetchFunc: () => window.fetch
		};
	}, []);

	return (
		<RequestFetchContextProvider value={value}>
			{props.children}
		</RequestFetchContextProvider>
	);
};
