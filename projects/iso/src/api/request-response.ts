import { DateTime } from 'luxon';
import { ServerError } from './error';

/** BPQ: < Body , Path , Query > */
export interface ApiRouteRequest<TBody extends ApiRouteRequestBody = ApiRouteRequestBody, TPath extends ApiRouteRequestPath = ApiRouteRequestPath, TQuery extends ApiRouteRequestQuery = ApiRouteRequestQuery> {
	/** Body params. Null if empty on the server. */
	body: TBody;
	/**
	 * Path params (like this/:param/here)
	 * All properties of the object are strings on the wire.
	 */
	path: TPath;
	/**
	 * Query params (search, like ?x=1&y=2).
	 * All properties of the object are strings on the wire.
	 */
	query: TQuery;
}

/** Can be null or an object of any type. */
export type ApiRouteRequestBody = null | {};
/** Can be null or a dictionary of strings. */
export type ApiRouteRequestPath = null | { [key: string]: string | undefined; };
/** Can be null or a dictionary of strings, booleans, or numbers (will be strings on the wire and deserialized on the server) */
export type ApiRouteRequestQuery = null | { [key: string]: string | number | boolean | DateTime | undefined; };

export interface ApiRouteResponse<TResponseInner extends ApiRouteResponseInner = ApiRouteResponseInner> {
	a: TResponseInner;

	/** Error, if included. */
	_err?: ServerError;
	// Add more here, with underscore
}

/** The type of the 'body' property inside the response  */
export type ApiRouteResponseInner = null | {};

/**
 * HTTP method types.
 */
export const enum HttpMethod {
	GET = 'get',
	POST = 'post',
	DELETE = 'delete',
	PUT = 'put'
}

export type ApiRouteRequestEmpty = ApiRouteRequest<null, null, null>;
export type ApiRouteResponseEmpty = ApiRouteResponse<null>;

export interface ApiRouteTypes
	<
		TReqBody extends ApiRouteRequestBody = ApiRouteRequestBody,
		TReqPath extends ApiRouteRequestPath = ApiRouteRequestPath,
		TReqQuery extends ApiRouteRequestQuery = ApiRouteRequestQuery,
		TResInner extends ApiRouteResponseInner = ApiRouteResponseInner,
	> {
	/** For typing only. */
	req: ApiRouteRequest<TReqBody, TReqPath, TReqQuery>;
	/** For typing only. */
	res: ApiRouteResponse<TResInner>;
}

/** < RequestBody, RequestPath, RequestQuery, ResponseBody > */
export interface ApiRoute
	<
		TPath extends string = string,
		TMethod extends HttpMethod = HttpMethod,
		TReqBody extends ApiRouteRequestBody = ApiRouteRequestBody,
		TReqPath extends ApiRouteRequestPath = ApiRouteRequestPath,
		TReqQuery extends ApiRouteRequestQuery = ApiRouteRequestQuery,
		TResInner extends ApiRouteResponseInner = ApiRouteResponseInner,
	> extends ApiRouteTypes<TReqBody, TReqPath, TReqQuery, TResInner> {
	/** Path to the route, without the '/api' prefix. */
	path: TPath;
	/** Method (get, post, etc). */
	method: TMethod;
}

export type ApiRouteTypesEmpty = ApiRouteTypes<null, null, null, null>;
export type ApiRouteTypesNoRequest<TResInner extends ApiRouteResponseInner> = ApiRouteTypes<null, null, null, TResInner>;
export type ApiRouteTypesNoResponse
	<
		TReqBody extends ApiRouteRequestBody,
		TReqPath extends ApiRouteRequestPath,
		TReqQuery extends ApiRouteRequestQuery
	> = ApiRouteTypes<TReqBody, TReqPath, TReqQuery, null>;

export type RequestOf<T extends ApiRouteTypes> = [T] extends [ApiRouteTypes<infer TReqBody, infer TReqPath, infer TReqQuery, any>] ? ApiRouteRequest<TReqBody, TReqPath, TReqQuery> : ApiRouteRequest;
export type OptionalRequestOf<T extends ApiRouteTypes> = [T] extends [ApiRouteTypes<null, null, null, any>] ? (RequestOf<T> | null) : RequestOf<T>;
export type RequestBodyOf<T extends ApiRouteTypes> = [T] extends [ApiRouteTypes<infer TReqBody, any, any, any>] ? TReqBody : null;
export type RequestPathOf<T extends ApiRouteTypes> = [T] extends [ApiRouteTypes<any, infer TReqPath, any, any>] ? TReqPath : null;
export type RequestQueryOf<T extends ApiRouteTypes> = [T] extends [ApiRouteTypes<any, any, infer TReqQuery, any>] ? TReqQuery : null;
export type ResponseOf<T extends ApiRouteTypes> = [T] extends [ApiRouteTypes<any, any, any, infer TResInner>] ? ApiRouteResponse<TResInner> : ApiRouteResponse;
export type ResponseInnerOf<T extends ApiRouteTypes> = [T] extends [ApiRouteTypes<any, any, any, infer TResInner>] ? TResInner : null;