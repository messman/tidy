import { Application, Request, Response, NextFunction } from 'express';
import { createWellsConfiguration, getAllForConfiguration } from 'tidy-server';
import { AllResponse } from 'tidy-shared';

export function configureApp(app: Application): void {
	addRoutes(app);

	// 404 handler
	app.use(function (_request: Request, response: Response, _next: NextFunction) {
		response.status(404).send("Not Found");
	});

	// Error handler
	app.use(function (error: Error, _request: Request, response: Response, _next: NextFunction) {
		console.error(error.stack)
		response.status(500).send('Server Error');
	});
}

const isCaching: boolean = false;
const cacheExpirationMilliseconds: number = 1000 * 60 * 10; // 10 minutes

function addRoutes(app: Application) {

	const stats: StatsResponse = {
		totalCacheBreaks: 0,
		recentCacheHits: 0,
		totalCacheHits: 0,
		totalHits: 0
	};

	let last: AllResponse | null = null;
	let cacheExpirationTime: number = -1;

	app.get("/latest", async (_: Request, response: Response<LatestResponse>) => {
		stats.totalHits++;

		if (isCaching) {
			const now = Date.now();

			// Check in cache.
			if (last && (now < cacheExpirationTime)) {
				stats.recentCacheHits++;
				stats.totalCacheHits++;

				return response.json({
					allResponse: last,
					isFromCache: true,
					cacheTimeRemaining: cacheExpirationTime - now
				});
			}
			else {
				stats.totalCacheBreaks++;
				stats.recentCacheHits = 0;
			}
		}

		last = await getResponse();
		cacheExpirationTime = Date.now() + cacheExpirationMilliseconds;

		return response.json({
			allResponse: last,
			isFromCache: false,
			cacheTimeRemaining: cacheExpirationMilliseconds
		});
	});

	app.get("/last", async (_: Request, response: Response<LastResponse>) => {
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

	app.get("/stats", async (_: Request, res: Response<StatsResponse>) => {
		return res.json(stats);
	});
}

async function getResponse(): Promise<AllResponse> {
	const configuration = createWellsConfiguration();
	return await getAllForConfiguration(configuration);
}

interface LatestResponse {
	allResponse: AllResponse,
	isFromCache: boolean,
	cacheTimeRemaining: number
}

interface LastResponse {
	allResponse: AllResponse | null,
	cacheTimeRemaining: number
}

interface StatsResponse {
	totalCacheBreaks: number,
	recentCacheHits: number,
	totalCacheHits: number,
	totalHits: number,
}