import { RunFlags } from './run-flags';

export type ServerLogger = typeof console.log;

export function createServerLog(runFlags: RunFlags | null): ServerLogger {
	if (!runFlags || !runFlags.logging.isActive) {
		return () => { };
	}
	return (...args) => {
		serverLog(runFlags, ...args);
	};
}

/** Wraps calls to console log. */
export function serverLog(runFlags: RunFlags | null, ...logArguments: any[]): void {
	if (runFlags && runFlags.logging.isActive) {
		const prefix = runFlags.logging.prefix || undefined;
		const time = Date.now() / 1000;
		console.log(prefix, time, ...logArguments);
	}
}