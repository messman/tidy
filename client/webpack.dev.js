console.log("~~~~~ DEVELOPMENT build ~~~~~");

const webpack = require("webpack");
const merge = require("webpack-merge");
const base = require("./webpack.base.js");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const tidyServer = require("tidy-server");
const jsStringify = require("javascript-stringify");

module.exports = async () => {

	const DEFINE = base.DEFINE;
	DEFINE.fetchUrl = JSON.stringify('http://localhost:8000/latest');

	const testData = base.args['data'];
	if (testData) {
		// If no value, it's true. Otherwise, it's the string value.
		const testDataString = testData === true ? 'default' : `'${testData}'`;
		console.log(`Adding local test data: ${testDataString}`);

		// Default to wells config.
		const wellsConfiguration = tidyServer.createWellsConfiguration();
		const response = await tidyServer.getAllTestForConfiguration(wellsConfiguration, testData === true ? null : testData);

		// Stringify to JS code, not to JSON (if we become JSON, we lose the Date objects).
		DEFINE.localTestData = jsStringify.stringify(response);
	}

	return merge(base.base, {
		mode: "development",

		devtool: "source-map",

		devServer: {
			port: 8888,
			contentBase: false,
			open: "google chrome"
		},

		plugins: [
			new webpack.DefinePlugin({ __DEFINE__: DEFINE }),
			new HTMLWebpackPlugin(base.html)
		]
	});
};