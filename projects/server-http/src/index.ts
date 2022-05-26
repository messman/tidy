import express = require('express');
import { NextFunction, Request, Response } from 'express';
import { createReplacer } from '@messman/wbt-iso';
import { configureApi } from './app';
import { settings } from './env';
import { baseLogger } from './logger';

const port = settings.PORT || 8000;
const app = express();

/*
	TODO: Check if this is the right way to reject HTTP.
*/
if (!settings.isDev) {
	app.use((req, res, next) => {
		if (!req.secure) {
			// Probably should upgrade instead.
			// Or maybe a proxy handles this anyway?
			// This might cause socket issues.
			res.sendStatus(500);
			return;
		}
		next();
	});
}

/*
	 TODO: Implement X-Frame-Options,
	 which prevents this site from being loaded in an iFrame.
	 Must be done on this server and the nginx proxy!
	 https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
*/

/*
	Routing:

	The nginx proxy handles routing. This server is but one piece.
	1. /icons/ - URLS (SVG assets from @messman/wbt-assets)
	2. /api/ - (this server)
	3. *.* - static files (from client)
	4. * - fallthrough to index.html (client-side routing)

	splitting up client-side views into bundles is abstracted away here - 
	the views would become JS bundles served as static files. They won't contain
	anything secure, so it doesn't matter if they are protected.
	This handles deep links, page refresh, etc.

	Page load flow:
	- User receives index.html and downloads the base bundle.
	- Base bundle code checks location, params, etc, and determines what view to show.
	- Showing that view may trigger lazy-load of other bundles, served as static files.
	- Existing or newly-loaded bundles may make requests to the API - these are behind auth checks.

	So potentially, before seeing the whole view, a user may have to wait on three requests to
	complete *in sequence*:
	1. load of index.html / initial bundle (cached, hopefully)
	2. load of specific view bundle (cached, hopefully)
	3. load of that view's specific API calls (likely not cached)

	nginx proxy docs:
	See https://stackoverflow.com/q/44796056
	and https://stackoverflow.com/a/46696098
	and https://stackoverflow.com/q/55764444
*/

/*
	#REF_API_DATE_SERIALIZATION
	As discussed in iso, Dates are serialized to strings and not deserialized back to Dates.
	There is a serialize/deserialize function pair that handles this issue.
*/
app.set('json replacer', createReplacer());

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

// Don't put any other middleware above this!
// TODO: use CORS at the proxy level.
/*
	A note on CORS:
	CORS is NOT a firewall. It does not prevent requests
	from executing. Use session checks for that.
*/
const allowedDomain = settings.isDev ? '*' : 'https://wellsbeachtime.com';
baseLogger.info(settings.isDev ? 'Using open CORS settings for development' : `Restricting via CORS to '${allowedDomain}'`);
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', allowedDomain);
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	if (req.method.toLowerCase() === 'options') {
		res.sendStatus(200);
	}
	else {
		next();
	}
});

// Set up API.
configureApi(app);

// Error handler
app.use(function (error: Error, _request: Request, response: Response, _next: NextFunction) {
	console.error(error);
	response.status(500).send('Server Error');
});

app.listen(port, () => {
	baseLogger.info(`Listening on ${port} (may be proxied)`);
});

// Used to check warnings in the log against the correct process.
console.log(`process id: ${process.pid}`);