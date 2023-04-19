import { Request, Response } from 'express';
import { ApiRoute, ApiRouteTypes, RequestOf, ResponseInnerOf } from '@wbtdevlocal/iso';
import { RequestContext } from './context';
import { ServerPromise } from './error';

/*
	Try to keep names of properties as close as possible to 
	Express: https://expressjs.com/en/4x/api.html#req
	Built-in: https://nodejs.org/api/http.html#http_class_http_incomingmessage
	Express: https://expressjs.com/en/4x/api.html#res
	Built-in: https://nodejs.org/api/http.html#http_class_http_serverresponse
*/

/**
 * To be returned from a custom handler when the handler is manually sending the response
 * (perhaps to send HTML or a file).
 **/
export const customHandlerResponse = 'CUSTOM_HANDLER_RESPONSE';

// /** For typing pre-handlers (middleware, essentially). We know very little about the request during these. */
// export type CustomRoutePreHandler = (context: RequestContext, params: ApiRouteRequest, request: Request, response: Response) => ServerPromise<null | typeof customHandlerResponse>;

export interface ResponseInnerOkOf<TApiRoute extends ApiRouteTypes> {
	_isOk: true;
	inner: ResponseInnerOf<TApiRoute>;
}

export function makeOk<TApiRoute extends ApiRouteTypes>(innerResponse: ResponseInnerOf<TApiRoute>): ResponseInnerOkOf<TApiRoute> {
	return {
		_isOk: true,
		inner: innerResponse
	};
}

export interface CustomRouteHandlerInput
	<
		TApiRoute extends ApiRoute = ApiRoute,
		TContext extends RequestContext = RequestContext
	> {
	ctx: TContext,
	params: RequestOf<TApiRoute>,
	req: Request,
	res: Response,
	/** Helps with type safety. */
	ok: (inner: ResponseInnerOf<TApiRoute>) => ResponseInnerOkOf<TApiRoute>;
}

/** The handler function for a route endpoint. */
export type CustomRouteHandler
	<
		TApiRoute extends ApiRoute = ApiRoute,
		TContext extends RequestContext = RequestContext
	>
	= (input: CustomRouteHandlerInput<TApiRoute, TContext>) => ServerPromise<ResponseInnerOkOf<TApiRoute> | typeof customHandlerResponse>;

export interface CustomRouteDefinition {
	route: ApiRoute;
	handler: CustomRouteHandler;
}

export function route<TApiRoute extends ApiRoute>(input: {
	route: TApiRoute,
	handler: CustomRouteHandler<TApiRoute>;
}): CustomRouteDefinition {
	const { route, handler } = input;
	return {
		route,
		handler: handler as any
	};
}