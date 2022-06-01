import * as uid from 'uid-safe';
import { baseLogger, LogContext } from '../services/logging/pino';

/**
 * Sets up the context object on our request so that we can easily 
 * access it later during mapping.
 * Note: This object is added to the request before it matches any route;
 * meaning, the requests could end up on a 404. This is by design:
 * we want to know what requests aren't getting picked up inside /api.
 */
export function createRequestContext(requestPath: string | null): RequestContext {
	// like 'sFvwTzI7oQY'
	const requestId = uid.sync(8);

	const context: RequestContext = {
		id: requestId,
		logger: baseLogger.child({
			requestId: requestId,
		}),
	};

	if (requestPath) {
		// Update our logger.
		context.logger = context.logger.child({
			requestPath: requestPath
		});
	}

	return context;
};

/** Base level properties necessary for logging, errors, and db calls. */
export interface RequestContext extends LogContext {
	/** The request ID. */
	id: string;
}