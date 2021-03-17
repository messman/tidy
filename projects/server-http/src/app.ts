import { Application, Request, Response } from 'express';
import { APIConfiguration, createWellsConfiguration, getAllForConfiguration } from 'tidy-server';
import { AllResponse, createReplacer } from 'tidy-shared';
import { processEnv } from './env';
import { createResponseMemory, ResponseMemory, ResponseMemoryStats } from './response-memory';

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

	/*
		Versioning and caching
		The client-side application is set up to refresh itself after a set time (e.g., 10 minutes).
		When the app refreshes, it will download the latest JS with the latest versioned API URL.
		For the time before the app refresh but after the new server is published, we need to still support the older API.
		The older API will not use cached responses.
	*/

	const memory: ResponseMemory<AllResponse> = createResponseMemory({
		isCaching: true,
		expiration: minutes(2)
	});

	// CURRENT
	app.get('/v3.5.0/latest', async (_: Request, response: Response<AllResponse>) => {

		const hit = memory.registerHit();
		if (hit.cacheItemValue) {
			log(`Latest cached - ${hit.timeRemainingInCache}ms remaining`);
			return response.json(hit.cacheItemValue);
		}

		const newest = await getResponse(createWellsConfiguration(), 'tidy-server', memory);
		return response.json(newest);
	});

	app.get('/last', async (_: Request, response: Response<AllResponse | null>) => {
		const hit = memory.registerHit();
		if (hit.cacheItemValue) {
			log(`Last cached - ${hit.timeRemainingInCache}ms remaining`);
			return response.json(hit.cacheItemValue);
		}
		return response.json(null);
	});

	app.get('/stats', async (_: Request, res: Response<ResponseMemoryStats>) => {
		return res.json(memory.stats);
	});

	app.get('/', async (_: Request, res: Response) => {
		return res.json({ status: 'ready' });
	});
}

async function getResponse(configuration: APIConfiguration, logPrefix: string, memory: ResponseMemory<AllResponse>): Promise<AllResponse> {
	const response = await getAllForConfiguration(configuration, {
		logging: {
			isActive: true,
			prefix: logPrefix
		},
		data: {
			seed: null
		},
		keys: {
			weather: openWeatherDebugAPIKey
		}
	});

	if (!!response.error) {
		const allErrors = response.error!.errors.map((issue) => {
			return issue.dev?.message || issue.userMessage;
		}).join(' | ');
		log('Errors:', allErrors);
		memory.setCacheItemValue(null);
		log('Returning with errors - not caching');
	}
	else {
		memory.setCacheItemValue(response);
		log(memory.isCaching ? `Returning and caching for ${memory.cacheExpiration}ms` : 'Returning - not caching');
	}
	return response;
}

function seconds(seconds: number): number {
	return seconds * 1000;
}

function minutes(minutes: number): number {
	return seconds(minutes * 60);
}