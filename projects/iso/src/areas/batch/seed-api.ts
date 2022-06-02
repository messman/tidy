import { ApiRoute, BaseApiRequest, BaseApiResponse } from '../../api/request-response';
import { BatchContent } from './batch';

export namespace Read {
	export type Route = ApiRoute<Request, Response>;
	export interface Request extends BaseApiRequest<null, null, Path> { }
	export interface Path {
		seed: string;
	}
	export interface Response extends BaseApiResponse, BatchContent { }
}