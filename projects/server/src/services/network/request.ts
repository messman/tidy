import nodeFetch from 'node-fetch';
import { serverErrors, ServerPromise } from '../../api/error';
import { LogContext } from '../logging/pino';

export async function makeRequest<T>(ctx: LogContext, serviceName: string, url: string): ServerPromise<T> {
	try {
		const res = await nodeFetch(url, { timeout: 10000 });
		if (res.ok) {
			const result = await res.json() as T;
			return result;
		}
		else {
			return serverErrors.internal.service(ctx, serviceName, {
				hiddenArea: 'fetch non-ok error',
				hiddenLog: { status: res.status, statusText: res.statusText }
			});
		}
	} catch (e) {
		return serverErrors.internal.service(ctx, serviceName, {
			hiddenArea: 'fetch exception',
			hiddenLog: { errorMessage: (e as Error).message }
		});
	}
}

export async function makeRequestAscii(ctx: LogContext, serviceName: string, url: string): ServerPromise<string> {
	try {
		const res = await nodeFetch(url, { timeout: 10000 });
		if (res.ok) {
			const result = await res.text();
			return result;
		}
		else {
			return serverErrors.internal.service(ctx, serviceName, {
				hiddenArea: 'fetch non-ok error',
				hiddenLog: { status: res.status, statusText: res.statusText }
			});
		}
	} catch (e) {
		return serverErrors.internal.service(ctx, serviceName, {
			hiddenArea: 'fetch exception',
			hiddenLog: { errorMessage: (e as Error).message }
		});
	}
}