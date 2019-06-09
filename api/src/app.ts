import express from "express";

import morgan from "morgan";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

export const app = express();

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// CORS 
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "tides.andrewmessier.com");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

import { router as indexRouter } from "./routes/index";
import { router as proxyRouter } from "./routes/proxy";

// Main API access route
app.use("/proxy", proxyRouter);

// Fall-through
app.use("/", indexRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error("Not Found");
	err["status"] = 404;
	next(err);
});

// Error handler
app.use(function (err, req, res, next) {
	// Set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// Render the error page
	res.status(err.status || 500);
	res.send("error");
});