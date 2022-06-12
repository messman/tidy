import * as iso from '@wbtdevlocal/iso';
import { route } from '../../api/wrap';
import { settings } from '../../env';
import { createResponseCache } from '../../services/cache/response-cache';
import { readBatch } from './batch-read';

let cacheMinutes = 3.5;
if (settings.CACHE_MINUTES !== undefined) {
	cacheMinutes = parseInt(settings.CACHE_MINUTES as string, 10);
}

const latestCache = createResponseCache<iso.Batch.LatestAPI.Read.Response>({
	expiration: iso.minutes(cacheMinutes)
});

export const routes = [
	route(iso.apiRoutes.batch.latest.read)
		(async (ctx, _params, _req, _res) => {
			const logger = ctx.logger;

			// Register a hit.
			const hit = latestCache.registerHit();

			// Check the cache.
			if (hit.cacheItemValue) {
				logger.info('Cached', { timeRemainingInCache: hit.timeRemainingInCache, meta: hit.cacheItemValue.meta });
				return hit.cacheItemValue;
			}

			const result = await readBatch(ctx);

			if (iso.isServerError(result)) {
				latestCache.setCacheItemValue(null);
				return result;
			}

			latestCache.setCacheItemValue(result);
			logger.info('Computed', { cacheForMs: latestCache.cacheExpiration, meta: result.meta });
			return result;
		}),
];