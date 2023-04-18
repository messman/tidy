import { ApiRouteBatchLatest } from '../areas/batch/latest-api';
import { ApiRouteBatchSeed } from '../areas/batch/seed-api';
import { ApiRoute, HttpMethod } from './request-response';

/**
 * The list of all API Routes available to the client.
 * 
 * Note: all paths must be started with a forward slash.
 * Note: all paths will be prepended with '/api'. 
 * 
 * Note: May need to inform the team to update Postman URLs.
 * 
 * Note: Use GET only if:
 * - The params can be serialized in the URL (no body)
 * - There are no changes to the database or side-effects
 *    (can be called multiple times)
 *    (no CSRF protection)
 *    (exception: it's okay if it re-ups the auth state)
 * 
 * Using namespaces here instead of an object because we can't go-to-definition on properties of objects.
 */
export namespace apiRoutes {
	export namespace batch {
		export const latest = { method: HttpMethod.GET, path: '/batch/latest', ...types<ApiRouteBatchLatest.Types>() } as const satisfies ApiRoute;
		export const seed = { method: HttpMethod.GET, path: '/batch/seed/:seed', ...types<ApiRouteBatchSeed.Types>() } as const satisfies ApiRoute;
	}
}

function types<T>(): T { return null!; }