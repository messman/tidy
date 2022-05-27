import { ApiRoute, ApiRouteEmpty, HttpMethod } from './request-response';

/**
 * The list of all API Routes available to the client.
 * 
 * Note: all paths must be started with a forward slash.
 * Note: all paths will be prepended with '/api'. 
 * 
 * Note: Use GET only if:
 * - The params can be serialized in the URL (no body)
 * - There are no changes to the database or side-effects
 *    (can be called multiple times)
 *    (no CSRF protection)
 *    (exception: it's okay if it re-ups the auth state)
 */
export const apiRoutes = {
	batch: {
		latest: get('/batch/latest') as ApiRouteEmpty,
	}
};

//////////////////////////////////////////////////
//////////////////////////////////////////////////

/** Creates a 'get' API Route. */
function get(path: string): ApiRoute<any, any> {
	return {
		path: path,
		method: HttpMethod.GET,
		// Ignore
		req: null!,
		res: null!
	};
}