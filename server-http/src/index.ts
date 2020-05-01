import express = require('express');
import { Request, Response, NextFunction } from 'express';
import { configureApp } from './app';

const port = 8000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS (since this is just for development)
app.use(function (_request: Request, response: Response, next: NextFunction) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

configureApp(app);

// 404 handler
app.use(function (_request: Request, response: Response, _next: NextFunction) {
	response.status(404).send("Not Found");
});

// Error handler
app.use(function (error: Error, _request: Request, response: Response, _next: NextFunction) {
	console.error(error.stack)
	response.status(500).send('Server Error');
});

app.listen(port, () => {
	console.log("Listening on " + port);
});