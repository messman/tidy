console.log("~~~~~ DEVELOPMENT build ~~~~~");

const webpack = require("webpack");
const merge = require("webpack-merge");
const base = require("./webpack.base.js");
const HTMLWebpackPlugin = require("html-webpack-plugin");

const DEFINE = base.DEFINE;
DEFINE.fetchUrl = JSON.stringify('http://localhost:8000/latest');

module.exports = merge(base.base, {
	mode: "development",

	devtool: "source-map",

	devServer: {
		port: 8888,
		contentBase: false,
		open: "google chrome"
	},

	plugins: [
		new webpack.DefinePlugin(DEFINE),
		new HTMLWebpackPlugin(base.html)
	]
});