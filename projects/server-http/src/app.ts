import { Application, json, NextFunction, Request, Response, Router, urlencoded } from 'express';
import { AllResponse } from '@messman/wbt-iso';
import { APIConfiguration, createWellsConfiguration, getAllForConfiguration } from '@messman/wbt-server';
import { settings } from './env';
import { baseLogger } from './logger';
import { createResponseMemory, ResponseMemory, ResponseMemoryStats } from './response-memory';

export function configureApi(app: Application): void {
	const router = Router();
	router.use(json());
	router.use(urlencoded({ extended: false }));

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

	router.get('/latest', async (_: Request, response: Response<AllResponse>) => {

		const hit = memory.registerHit();
		if (hit.cacheItemValue) {
			baseLogger.info(`Latest cached - ${hit.timeRemainingInCache}ms remaining`);
			return response.json(hit.cacheItemValue);
		}

		const newest = await getResponse(createWellsConfiguration(), 'tidy-server', memory);
		return response.json(newest);
	});

	router.get('/last', async (_: Request, response: Response<AllResponse | null>) => {
		const hit = memory.registerHit();
		if (hit.cacheItemValue) {
			baseLogger.info(`Last cached - ${hit.timeRemainingInCache}ms remaining`);
			return response.json(hit.cacheItemValue);
		}
		return response.json(null);
	});

	router.get('/stats', async (_: Request, res: Response<ResponseMemoryStats>) => {
		return res.json(memory.stats);
	});

	router.get('/', async (_: Request, res: Response) => {
		return res.json({ status: 'ready' });
	});

	// 404 handler
	router.use(function (_request: Request, response: Response, _next: NextFunction) {
		response.status(404).send('Not Found');
	});

	app.use('/api', router);
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
			weather: settings.KEY_OPEN_WEATHER!
		}
	});

	if (!!response.error) {
		const allErrors = response.error!.errors.map((issue) => {
			return issue.dev?.message || issue.userMessage;
		}).join(' | ');
		baseLogger.info('Errors:', allErrors);
		memory.setCacheItemValue(null);
		baseLogger.info('Returning with errors - not caching');
	}
	else {
		memory.setCacheItemValue(response);
		baseLogger.info(memory.isCaching ? `Returning and caching for ${memory.cacheExpiration}ms` : 'Returning - not caching');
	}
	return response;
}

function seconds(seconds: number): number {
	return seconds * 1000;
}

function minutes(minutes: number): number {
	return seconds(minutes * 60);
}