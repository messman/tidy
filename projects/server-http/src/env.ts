export interface ProcessEnv {
	PORT: number;
	NODE_ENV: string;
	KEY_OPEN_WEATHER: string;
	TEST_VALUE: string;
}
export const processEnv = (process.env || {}) as unknown as Partial<ProcessEnv>;
console.log('process.env.TEST_VALUE', processEnv.TEST_VALUE);