import express = require('express');
import { configureApp } from './app';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = 8000;

configureApp(app);

app.listen(port, () => {
	console.log("Listening on " + port);
});