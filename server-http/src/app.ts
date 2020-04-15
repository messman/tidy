import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";

export const app = express();

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

import { router as proxyRouter } from "./routes/proxy";

// Fall-through
app.use("/", proxyRouter);

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