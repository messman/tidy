import { ApiRoute, BaseApiRequest, BaseApiResponse } from '../../api/request-response';
import { BatchContent } from './batch-iso';

export namespace Read {
	export type Route = ApiRoute<Request, Response>;
	export interface Request extends BaseApiRequest<null, null, null> { }
	export interface Response extends BaseApiResponse, BatchContent { }
}
