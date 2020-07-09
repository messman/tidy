export interface ProcessEnv {
	PORT: number,
	NODE_ENV: string,
	KEY_OPEN_WEATHER: string;
}
export const processEnv = (process.env || {}) as unknown as Partial<ProcessEnv>;