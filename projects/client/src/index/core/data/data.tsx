import * as React from 'react';
import { CONSTANT } from '@/index/constant';
import { DEFINE } from '@/index/define';
import { createContextConsumer } from '@messman/react-common';
import { ApiRouteBatchLatest, ApiRouteBatchSeed, apiRoutes, AstroSolarEvent, Batch, TidePointExtremeComp } from '@wbtdevlocal/iso';
import { useSafeTimer } from '../lifecycle/timer';
import { useDataSeed } from './data-seed';
import { RequestResult, RequestResultError } from './request';
import { ApiRequestOptions, useApiRequest } from './request-hook';

export interface BatchWithHelpers extends Batch {
	/** Typed optimistically, but returns `null` if there is no data. */
	getTideExtremeById: (id: string) => TidePointExtremeComp;
	/** Typed optimistically, but returns `null` if there is no data. */
	getSolarEventById: (id: string) => AstroSolarEvent;
}

export interface BatchResponseState {
	isLoading: boolean;
	error: RequestResultError | null;
	success: Batch | null;
}

export interface BatchResponseOutput extends Omit<BatchResponseState, 'success'> {
	restart: () => void;
	success: BatchWithHelpers | null;
}

const [BatchResponseContextProvider, useBatchResponseContext] = createContextConsumer<BatchResponseOutput>(null!);

export const useBatchResponse = useBatchResponseContext;

export const useBatchResponseSuccess = () => useBatchResponseContext().success!;

export const BatchResponseProvider: React.FC<React.PropsWithChildren> = (props) => {

	const [seed] = useDataSeed();

	const [state, setState] = React.useState<BatchResponseState>(() => {
		return {
			isLoading: false,
			error: null,
			success: null
		};
	});

	const { change } = useSafeTimer(() => {
		makeRequest();
	});

	function onResult(result: RequestResult<ApiRouteBatchLatest.ResponseInner | ApiRouteBatchSeed.ResponseInner>) {
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
			success: result.data.batch
		});

		// Start timer for refresh
		change(CONSTANT.appRefreshTimeout);
	}

	const { start: startLatest } = useApiRequest(apiRoutes.batch.latest, onResult);
	const { start: startSeed } = useApiRequest(apiRoutes.batch.seed, onResult);

	const makeRequest = React.useCallback(() => {
		const requestOptions: ApiRequestOptions = {
			min: CONSTANT.fetchMinTimeout,
			max: CONSTANT.fetchMaxTimeout
		};

		if (seed) {
			startSeed({ body: null, path: { seed: seed }, query: { key: DEFINE.clientKey } }, requestOptions);
		}
		else {
			startLatest({ body: null, path: null, query: { key: DEFINE.clientKey } }, requestOptions);
		}

		setState((p) => {
			return {
				...p,
				isLoading: true,
			};
		});
	}, [seed]);

	// Start it immediately or after any seed change.
	React.useEffect(() => {
		makeRequest();
	}, [seed]);

	const value = React.useMemo<BatchResponseOutput>(() => {

		// Yay maps!
		const tideExtremeMap = new Map<string, TidePointExtremeComp>(
			(state.success?.tideExtrema || []).map((extreme) => {
				return [extreme.id, extreme];
			})
		);
		const solarEventMap = new Map<string, AstroSolarEvent>(
			(state.success?.solarEvents || []).map((event) => {
				return [event.id, event];
			})
		);

		return {
			...state,
			restart: makeRequest,
			success: state.success ?
				{
					...state.success,
					getTideExtremeById: (id: string) => {
						return tideExtremeMap.get(id)!;
					},
					getSolarEventById: (id: string) => {
						return solarEventMap.get(id)!;
					}
				} : null
		};
	}, [state, makeRequest]);

	return (
		<BatchResponseContextProvider value={value}>
			{props.children}
		</BatchResponseContextProvider>
	);
};