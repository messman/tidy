import { baseLogger } from './services/logging/pino';

/*
	We also use WBT_SEQ_URL, but it's needed for logging, so it can't be used here.
*/
export interface ProcessEnv {
	PORT: number;
	NODE_ENV: string;
	KEY_OPEN_WEATHER: string;
	TEST_VALUE: string;
	CACHE_MINUTES: string | number;
	CLIENT_KEY: string; // #REF_CLIENT_KEY
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
		processEnv = Object.assign({}, processEnv, require('../env-dev-public.js'), require('../env-dev-secret.j'));
	}
	catch (e) {
		baseLogger.error('env - catch on loading env-dev', { error: e });
	}
}

if (!processEnv.KEY_OPEN_WEATHER) {
	throw new Error('No OpenWeather API key found. Are you missing an environment variable?');
}
if (!processEnv.CLIENT_KEY) {
	throw new Error('No client key found. Clients will not connect correctly.');
}

export const settings: Settings = {
	...processEnv,
	isDev,
};

baseLogger.info('env - loaded', { TEST_VALUE: settings.TEST_VALUE });

// Set our global logging level
baseLogger.level = isDev ? 'debug' : 'info';