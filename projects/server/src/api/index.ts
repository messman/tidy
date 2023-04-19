const express = require('express');
import { Application, Request, RequestHandler, Response, Router } from 'express';
import { ApiRoute, ApiRouteRequest, ApiRouteResponse, createSerializationReviver, isEmptyObject, isServerError, scrubServerError, ServerError } from '@wbtdevlocal/iso';
import { routes as batchLatestRoutes } from '../areas/batch/latest-handle';
import { routes as batchSeedRoutes } from '../areas/batch/seed-handle';
import { baseLogger } from '../services/logging/pino';
import { createRequestContext, RequestContext } from './context';
import { serverErrors } from './error';
import { customHandlerResponse, CustomRouteDefinition, CustomRouteHandler, makeOk, ResponseInnerOkOf } from './wrap';

export function configureApi(app: Application): void {
	const router = Router();
	router.use(express.json({ reviver: createSerializationReviver() })); // #REF_API_DATE_SERIALIZATION
	router.use(express.urlencoded({ extended: false }));

	// Create request pre-context object.
	router.use((req, _res, next) => {
		req._ctx = createRequestContext(req.path);
		next();
	});

	router.get('/', (req, res) => {
		req._ctx.logger.debug('API is ready.');
		return res.json({ status: 'ready' });
	});

	// Add routes.
	attachRoutes(router, [
		// Match directory order

		// Batch
		...batchLatestRoutes,
		...batchSeedRoutes,
	]);

	// 404 handler
	router.use((req, res) => {
		sendServerError(res, serverErrors.wire.routeNotFound(req._ctx, {
			hiddenArea: '404 handler',
			hiddenLog: { method: req.method }
		}));
	});

	// Note: error handler is in main application code.

	// Route into the '/api/' path
	app.use('/api', router);
}

function attachRoutes(router: Router, customRoutes: CustomRouteDefinition[]) {
	const usedRoutes = new Set<ApiRoute>();
	const duplicateRoutes = new Set<ApiRoute>();

	for (let i = 0; i < customRoutes.length; i++) {
		const customRoute = customRoutes[i];
		const { route, handler } = customRoute;

		// Check for duplication
		if (usedRoutes.has(route)) {
			duplicateRoutes.add(route);
		}
		else {
			usedRoutes.add(route);
		}

		const handlers: CustomRouteHandler[] = [handler];

		const wrappedHandlers = handlers.map<RequestHandler>((customHandler, i) => {
			const isMainHandler = i === handlers.length - 1;

			return async function (req, res, next) {
				const ctx = req._ctx as RequestContext;
				const params = paramsOf(req);

				// Global error handler
				let result: any = null!;
				try {
					result = await customHandler({ ctx, params, req, res, ok: makeOk });
				}
				catch (e) {
					sendServerError(res, serverErrors.internal.unknown(ctx, e as Error, {
						hiddenArea: isMainHandler ? 'route handler wrap try/catch' : 'pre-handler wrap try/catch',
						// TODO: Be careful about including user-sent values for additional logging.
						hiddenLog: { i }
					}));
					return;
				}

				if (result === customHandlerResponse) {
					// A custom response has been sent. No need to do anything.
				}
				else if (isServerError(result)) {
					sendServerError(res, result);
				}
				else if (!isMainHandler) {
					next();
				}
				else {
					// Must be the result for the main handler
					const resultOk = result as ResponseInnerOkOf<any>;
					sendSuccess(res, {
						a: resultOk.inner,
						//_err: undefined
					});
				}
			};
		});

		// Like router.get('/api/...', ...)
		router[route.method](route.path, ...wrappedHandlers);

	}

	duplicateRoutes.forEach((route) => {
		baseLogger.warn(`Route duplicated: ${route.method} ${route.path}`);
	});
}


/** 
 * Retrieves the parameters from an Express request.
 * Transforms empty objects into null.
 */
function paramsOf<TRequest extends ApiRouteRequest>(req: Request): TRequest {
	return {
		body: isEmptyObject(req.body) ? null : req.body,
		query: req.query,
		path: req.params
	} as unknown as TRequest;
}


function sendServerError(res: Response, serverError: ServerError): void {
	sendResponse(res, serverError.form.statusCode, {
		a: null,
		_err: scrubServerError(serverError)
	});
}

function sendSuccess(res: Response, routeResponse: ApiRouteResponse | null): void {
	sendResponse(res, 200, routeResponse);
}

function sendResponse(res: Response, status: number, routeResponse: ApiRouteResponse | null): void {
	res.status(status).json(routeResponse);
}