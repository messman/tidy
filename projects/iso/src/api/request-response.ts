import { ServerError } from './error';

/** < Body , Query , Path > */
export interface BaseApiRequest<TBody extends RequestDataType = RequestDataType, TQuery extends RequestDataType = RequestDataType, TPath extends RequestDataType = RequestDataType> {
	/** Body params. Null if empty on the server. */
	body: TBody;
	/**
	 * Query params (search, like ?x=1&y=2).
	 * All properties of the object are strings on the wire.
	 */
	query: TQuery;
	/**
	 * Path params (like this/:param/here)
	 * All properties of the object are strings on the wire.
	 */
	path: TPath;
}

/** These data types (body, query, path) can only be objects or null. Not primitives. */
export type RequestDataType = null | {};

export interface BaseApiResponse {
	/** Error, if included. */
	_err?: ServerError;
}

/**
 * HTTP method types.
 */
export const enum HttpMethod {
	GET = 'get',
	POST = 'post',
	DELETE = 'delete',
	PUT = 'put'
}

export type ApiRouteRequest = BaseApiRequest | null;
export type ApiRouteResponse = BaseApiResponse;

/** Objects like query and path are split and sent as strings (in the URL). Thus, the properties of the objects should be strings that must be re-typed on the server. */
export type StringOnWire<T extends RequestDataType> = T extends object ? { [Key in keyof T]: T[Key] | string | undefined } : null;

export type MaliciousBody<T> = { [P in keyof T]: any };

/** How we should treat the request object on the server, where we must be more security-conscious */
export type ApiRouteRequestOnServer<T extends ApiRouteRequest> = T extends BaseApiRequest<infer Body, infer Query, infer Path> ? BaseApiRequest<Body extends null ? null : MaliciousBody<Body> | null, StringOnWire<Query>, StringOnWire<Path>> : null;

export interface ApiRoute
	<
	TRequest extends ApiRouteRequest,
	TResponse extends ApiRouteResponse,
	> {
	/** Path to the route, without the '/api' prefix. */
	path: string;
	/** Method (get, post, etc). */
	method: HttpMethod;

	/** Ignore. */
	res: TResponse;
	/** Ignore. */
	req: TRequest;
}

export type ApiRouteEmpty = ApiRoute<null, ApiRouteResponse>;
export type ApiRouteNoRequest<TResponse extends ApiRouteResponse = ApiRouteResponse> = ApiRoute<null, TResponse>;
export type ApiRouteNoResponse<TRequest extends ApiRouteRequest = ApiRouteRequest> = ApiRoute<TRequest, ApiRouteResponse>;