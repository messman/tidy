import { Application, NextFunction, Request, Response } from 'express';
import { createWellsConfiguration, getAllForConfiguration } from 'tidy-server';
import { AllResponse, createReplacer } from 'tidy-shared';
import { processEnv } from './env';

const isCaching: boolean = true;
const cacheExpirationMilliseconds: number = 1000 * 60 * 2; // 2 minutes

interface TestEnv {
	OpenWeatherDebugAPIKey: string;
}
let openWeatherDebugAPIKey: string | null = processEnv.KEY_OPEN_WEATHER || null;
if (!openWeatherDebugAPIKey && processEnv.NODE_ENV === 'dev') {
	try {
		const env: TestEnv = require('../test-env.json');
		openWeatherDebugAPIKey = env.OpenWeatherDebugAPIKey;
	}
	catch (e) {
		log(e);
	}
}

function log(...args: any[]): void {
	console.log('>', ...args);
}

export function configureApp(app: Application): void {
	const stats: StatsResponse = {
		totalCacheBreaks: 0,
		recentCacheHits: 0,
		totalCacheHits: 0,
		totalHits: 0
	};

	let last: AllResponse | null = null;
	let cacheExpirationTime: number = -1;

	/*
		As discussed in tidy-shared, Dates are serialized to strings and not deserialized back to Dates.
		There is a serialize/deserialize function pair that handles this issue.

		See 
		https://itnext.io/how-json-stringify-killed-my-express-server-d8d0565a1a61
		https://github.com/expressjs/express/pull/2422

		There is a way to set a custom stringify replacer, but for all endpoints, not just one.
		If you want to do just one, you have to use send instead of json and serialize yourself.
		This isn't impossible - source code is here:
		https://github.com/expressjs/express/blob/master/lib/response.js#L239
		and also mentioned in Medium article above.

		For this app, we'll just do it globally.
	*/
	app.set('json replacer', createReplacer());

	app.get('/latest', async (_: Request, response: Response<AllResponse>, next: NextFunction) => {
		stats.totalHits++;
		if (isCaching) {
			const now = Date.now();

			// Check in cache.
			if (last && (now < cacheExpirationTime)) {
				stats.recentCacheHits++;
				stats.totalCacheHits++;

				log(`Latest cached - ${cacheExpirationTime - now}ms remaining`);
				return response.json(last);
			}
			else {
				stats.totalCacheBreaks++;
				stats.recentCacheHits = 0;
			}
		}

		let newest: AllResponse = null!;
		let hasErrors = false;
		try {
			newest = await getResponse();
			hasErrors = !!newest.error;
			if (hasErrors) {
				const allErrors = newest.error!.errors.map((issue) => {
					return issue.dev?.message || issue.userMessage;
				}).join(' | ');
				log('Errors:', allErrors);
			}
			else {
				last = newest;
			}
		}
		catch (e) {
			console.error(e);
			return next(new Error('Error retrieving data.'));
		}
		cacheExpirationTime = Date.now() + cacheExpirationMilliseconds;

		const errorText = hasErrors ? ' with errors' : '';
		const cachingText = !hasErrors && isCaching ? ` caching for ${cacheExpirationMilliseconds}ms` : ' not caching';
		log(`Latest${errorText} -${cachingText}`);

		return response.json(newest);
	});

	app.get('/last', async (_: Request, response: Response<LastResponse>) => {
		if (!last) {
			return response.json({
				allResponse: null,
				cacheTimeRemaining: 0
			});
		}

		return response.json({
			allResponse: last,
			cacheTimeRemaining: Date.now() - cacheExpirationTime
		});
	});

	app.get('/stats', async (_: Request, res: Response<StatsResponse>) => {
		return res.json(stats);
	});

	app.get('/', async (_: Request, res: Response) => {
		return res.json({ status: 'ready' });
	});
}

async function getResponse(): Promise<AllResponse> {
	const configuration = createWellsConfiguration();
	return await getAllForConfiguration(configuration, {
		logging: {
			isActive: true,
			prefix: 'tidy-server'
		},
		data: {
			seed: null
		},
		keys: {
			weather: openWeatherDebugAPIKey
		}
	});
}

interface LastResponse {
	allResponse: AllResponse | null,
	cacheTimeRemaining: number;
}

interface StatsResponse {
	totalCacheBreaks: number,
	recentCacheHits: number,
	totalCacheHits: number,
	totalHits: number,
}