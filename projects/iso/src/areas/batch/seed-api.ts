import { ApiRouteTypes } from '../../api/request-response';
import { BatchContent } from './batch-iso';

export namespace ApiRouteBatchSeed {
	export type Types = ApiRouteTypes<null, Path, null, ResponseInner>;

	export type Path = {
		seed: string;
	};

	export interface ResponseInner {
		batch: BatchContent;
	}
}