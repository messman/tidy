import * as pino from 'pino';

export interface LogContext {
	logger: pino.Logger;
}

// Looking for how pino streams to seq? See the starting scripts.
// Options: https://getpino.io/#/docs/api?id=options
export const baseLogger = pino({
	name: 'strudel-server-web',
	nestedKey: 'data',
	hooks: {
		// https://getpino.io/#/docs/api?id=logmethod
		logMethod: function (inputArgs, method, _level) {
			// Swap so that it's msg, then object, then other args.
			const inputArgsLength = inputArgs.length;
			const arg1 = inputArgs.shift();
			if (inputArgsLength >= 2) {
				const arg2 = inputArgs.shift();
				return method.apply(this, [arg2, arg1, ...inputArgs]);
			}
			return method.apply(this, [arg1]);
		}
	}
});
baseLogger.info('================ STARTUP ================');
