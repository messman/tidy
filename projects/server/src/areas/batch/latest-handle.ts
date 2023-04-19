import { apiRoutes, isServerError, minutesToMs } from '@wbtdevlocal/iso';
import { ApiRouteBatchLatest } from '@wbtdevlocal/iso/dist/areas/batch/latest-api';
import { route } from '../../api/wrap';
import { settings } from '../../env';
import { createResponseCache } from '../../services/cache/response-cache';
import { readBatch } from './batch-read';

let cacheMinutes = 3.5;
if (settings.CACHE_MINUTES !== undefined) {
	cacheMinutes = parseInt(settings.CACHE_MINUTES as string, 10);
}

const latestCache = createResponseCache<ApiRouteBatchLatest.ResponseInner>({
	expiration: minutesToMs(cacheMinutes)
});

export const routes = [
	route({
		route: apiRoutes.batch.latest,
		handler: async ({ ctx, ok }) => {
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
];