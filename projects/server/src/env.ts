import { baseLogger } from './services/logging/pino';

export interface ProcessEnv {
	PORT: number;
	NODE_ENV: string;
	KEY_OPEN_WEATHER: string;
	TEST_VALUE: string;
	CACHE_MINUTES: string | number;
}

export interface Settings extends Partial<ProcessEnv> {
	isDev: boolean;
}

// In production, environment variables will be set by the host and available on process.
let processEnv = (process.env || {}) as unknown as Partial<ProcessEnv>;

const isDev = processEnv.NODE_ENV === 'dev';

if (isDev && !processEnv.KEY_OPEN_WEATHER) {
	// Load other settings from JSON
	try {
		processEnv = Object.assign({}, processEnv, require('../env-dev-public.json'), require('../env-dev-secret.json'));
	}
	catch (e) {
		baseLogger.error('env - catch on loading env-dev', { error: e });
	}
}

if (!processEnv.KEY_OPEN_WEATHER) {
	throw new Error('No OpenWeather API key found. Are you missing an environment variable?');
}

export const settings: Settings = {
	...processEnv,
	isDev,
};

baseLogger.info('env - loaded', { TEST_VALUE: settings.TEST_VALUE });

// Set our global logging level
baseLogger.level = isDev ? 'debug' : 'info';