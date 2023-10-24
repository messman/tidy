import { ApiRouteBatchLatest, apiRoutes, isInNumberEnum, isServerError, minutesToMs, Seed, ServerError } from '@wbtdevlocal/iso';
import { RequestContext } from '../../api/context';
import { serverErrors } from '../../api/error';
import { route } from '../../api/wrap';
import { settings } from '../../env';
import { createResponseCache } from '../../services/cache/response-cache';
import { TestSeed } from '../../services/test/randomize';
import { readBatch, readBatchWithSeed } from './batch-read';

let cacheMinutes = 3.5;
if (settings.CACHE_MINUTES !== undefined) {
	cacheMinutes = parseInt(settings.CACHE_MINUTES as string, 10);
}
const latestCache = createResponseCache<ApiRouteBatchLatest.ResponseInner>({
	expiration: minutesToMs(cacheMinutes)
});

function verifyClientKey(ctx: RequestContext, key: unknown): ServerError | null {
	if (!key) {
		return serverErrors.logic.missingParams(ctx, {
			publicDesc: 'key is missing'
		});
	}
	if (typeof key !== 'string') {
		return serverErrors.logic.troubleParams(ctx, {
			publicDesc: 'key value is not valid',
			hiddenLog: { key }
		});
	}
	if (key !== settings.CLIENT_KEY) {
		// #REF_CLIENT_KEY
		return serverErrors.internal.mismatch(ctx, key, settings.CLIENT_KEY!, {
			hiddenArea: 'verify client key'
		});
	}
	return null;
}

export const routes = [
	/* Main endpoint for loading data */
	route({
		route: apiRoutes.batch.latest,
		handler: async ({ params, ctx, ok }) => {
			const keyServerError = verifyClientKey(ctx, params.query.key);
			if (isServerError(keyServerError)) {
				return keyServerError;
			}

			const logger = ctx.logger;

			// Register a hit.
			const hit = latestCache.registerHit();

			// Check the cache.
			if (hit.cacheItemValue) {
				logger.info('Cached', { timeRemainingInCache: hit.timeRemainingInCache, meta: hit.cacheItemValue.batch.meta });
				return ok(hit.cacheItemValue);
			}

			const result = await readBatch(ctx);

			if (isServerError(result)) {
				latestCache.setCacheItemValue(null);
				return result;
			}

			latestCache.setCacheItemValue({ batch: result });
			logger.info('Computed', { cacheForMs: latestCache.cacheExpiration, meta: result.meta });
			return ok({
				batch: result
			});
		}
	}),

	/** Seeds for testing */
	route({
		route: apiRoutes.batch.seed,
		handler: async ({ ctx, params, ok }) => {
			const keyServerError = verifyClientKey(ctx, params.query.key);
			if (isServerError(keyServerError)) {
				return keyServerError;
			}

			const seed = params.path.seed;
			if (!seed) {
				return serverErrors.logic.missingParams(ctx, {
					publicDesc: 'seed is missing'
				});
			}
			if (!isInNumberEnum(Seed, seed)) {
				return serverErrors.logic.troubleParams(ctx, {
					publicDesc: 'seed value is not valid',
					hiddenLog: { seed }
				});
			}
			const response = await readBatchWithSeed(ctx, seed as TestSeed);
			ctx.logger.info('Seed', { seed });
			return ok({
				batch: response
			});
		}
	}),
];