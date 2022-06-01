/*
	Helps us add custom properties to external types.

	See https://stackoverflow.com/a/58788706 & https://stackoverflow.com/a/55718334
*/

import { RequestContext } from '@/api/context';

declare module 'express-serve-static-core' {
	interface Request {
		_ctx: RequestContext;
	}
	interface Response {
	}
}