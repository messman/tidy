const express = require('express');
import { Application, Request, Router } from 'express';
import * as iso from '@wbtdevlocal/iso';
import { routes as batchLatestRoutes } from '../areas/batch/latest-handle';
import { routes as batchSeedRoutes } from '../areas/batch/seed-handle';
import { createRequestContext, RequestContext } from './context';
import { serverErrors } from './error';
import { customHandlerResponse, CustomRouters, sendServerError, sendSuccess } from './wrap';

export function configureApi(app: Application): void {
	const router = Router();
	router.use(express.json());
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
	app.use('/api/v4-0', router);
}

function attachRoutes(router: Router, customRoutes: CustomRouters) {
	for (let i = 0; i < customRoutes.length; i++) {
		const customRoute = customRoutes[i];
		const { route, preHandlers, handler } = customRoute;

		// Like router.get('/api/...', ...)
		router[route.method](route.path, ...preHandlers, async function (req, res, _next) {
			const ctx = req._ctx as RequestContext;
			const params = paramsOf(req);
			// Global error handler
			let result: any = null!;
			try {
				result = await handler(ctx, params, req, res);
			}
			catch (e) {
				sendServerError(res, serverErrors.internal.unknown(ctx, e as Error, {
					hiddenArea: 'route handler try/catch',
					// Be careful about including user-sent values for additional logging.
				}));
				return;
			}

			if (result === customHandlerResponse) {
				// A custom response has been sent. No need to do anything.
			}
			else if (iso.isServerError(result)) {
				sendServerError(res, result);
			}
			else {
				sendSuccess(res, result);
			}
		});
	}
}

/** 
 * Retrieves the parameters from an Express request.
 * Transforms empty objects into null.
 */
function paramsOf<TRequest extends iso.ApiRouteRequest>(req: Request): TRequest {
	return {
		body: iso.isEmptyObject(req.body) ? null : req.body,
		query: req.query,
		path: req.params
	} as unknown as TRequest;
}