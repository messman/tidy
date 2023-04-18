import { ApiRouteTypes } from '../../api/request-response';
import { BatchContent } from './batch-iso';

export namespace ApiRouteBatchLatest {
	export type Types = ApiRouteTypes<null, null, null, ResponseInner>;

	export interface ResponseInner {
		batch: BatchContent;
	}
}
