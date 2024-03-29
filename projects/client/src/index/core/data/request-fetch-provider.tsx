import * as React from 'react';
import { createContextConsumer } from '@messman/react-common';
import { ApiRoute, RequestOf } from '@wbtdevlocal/iso';
import { FetchFunc } from './request';

export type CreateFetchFunc = <TApiRoute extends ApiRoute>(route: ApiRoute, input: RequestOf<TApiRoute>) => FetchFunc;


export interface RequestFetchProviderOutput {
	createFetchFunc: CreateFetchFunc;
}

export const [RequestFetchContextProvider, useRequestFetch] = createContextConsumer<RequestFetchProviderOutput>();

export const RequestFetchProvider: React.FC<React.PropsWithChildren> = (props) => {

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
