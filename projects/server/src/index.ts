import express = require('express');
import { NextFunction, Request, Response } from 'express';
import { createReplacer } from '@wbtdevlocal/iso';
import { configureApi } from './api';
import { settings } from './env';
import { baseLogger } from './services/logging/pino';

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
	#REF_API_DATE_SERIALIZATION
	Dates are serialized to strings and not deserialized back to Dates.
	There is a serialize/deserialize function pair that handles this issue.
*/
app.set('json replacer', createReplacer());

/*
	A note on CORS:
	CORS is NOT a firewall. It does not prevent requests from executing - 
	it just prevents other websites from calling straight to us without a proxy.
	You need authentication / IP rate limiting to prevent other requests.
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
	baseLogger.info(`Ready! Listening at :${port}`);
});

// Used to check warnings in the log against the correct process.
baseLogger.info(`process id: ${process.pid}`);