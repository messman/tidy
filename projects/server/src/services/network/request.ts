import nodeFetch, { Response } from 'node-fetch';
import { serverErrors, ServerPromise } from '../../api/error';
import { LogContext } from '../logging/pino';

// Set larger request timeout because OFS takes awhile to pull from
const requestTimeout = 15_000;

export async function makeRequestJson<T>(ctx: LogContext, serviceName: string, url: string): ServerPromise<T> {
	return await makeRequest<T>(ctx, serviceName, url, async (res) => {
		return await res.json() as T;
	});
}

export async function makeRequestAscii(ctx: LogContext, serviceName: string, url: string): ServerPromise<string> {
	return await makeRequest<string>(ctx, serviceName, url, async (res) => {
		return await res.text();
	});
}

async function makeRequest<T>(ctx: LogContext, serviceName: string, url: string, asType: (res: Response) => Promise<T>): ServerPromise<T> {
	try {
		const res = await nodeFetch(url, { timeout: requestTimeout });
		if (res.ok) {
			return await asType(res);
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