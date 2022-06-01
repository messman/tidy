import { Request, RequestHandler, Response } from 'express';
import * as iso from '@wbtdevlocal/iso';
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

export type CustomRouteHandler<TRequest extends iso.ApiRouteRequest, TResponse extends iso.ApiRouteResponse>
	= (context: RequestContext, params: iso.ApiRouteRequestOnServer<TRequest>, request: Request, response: Response) => ServerPromise<TResponse | typeof customHandlerResponse>;

export interface CustomRoute<TRequest extends iso.ApiRouteRequest, TResponse extends iso.ApiRouteResponse> {
	route: iso.ApiRoute<TRequest, TResponse>;
	preHandlers: RequestHandler[];
	handler: CustomRouteHandler<TRequest, TResponse>;
}

export type CustomRouters = CustomRoute<any, any>[];

export interface RouteFunc<TRequest extends iso.ApiRouteRequest, TResponse extends iso.ApiRouteResponse> {
	(handler: CustomRouteHandler<TRequest, TResponse>): CustomRoute<TRequest, TResponse>;
}
export function route<TRequest extends iso.ApiRouteRequest, TResponse extends iso.ApiRouteResponse>
	(route: iso.ApiRoute<TRequest, TResponse>): RouteFunc<TRequest, TResponse> {

	return (handler) => {
		return {
			route,
			preHandlers: [],
			handler
		};
	};
}

export function sendServerError(res: Response, serverError: iso.ServerError): void {
	const response: iso.ApiRouteResponse = {
		_err: iso.scrubServerError(serverError)
	};
	sendResponse(res, serverError.form.statusCode, response);
}

export function sendSuccess(res: Response, body: iso.ApiRouteResponse | null): void {
	sendResponse(res, 200, body);
}

function sendResponse(res: Response, status: number, body: iso.ApiRouteResponse | null): void {
	res.status(status).json(body);
}