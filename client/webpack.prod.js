console.log("~~~~~ PRODUCTION build ~~~~~");

const webpack = require("webpack");
const merge = require("webpack-merge");
const base = require("./webpack.base.js");
const HTMLWebpackPlugin = require("html-webpack-plugin");

const DEFINE = base.DEFINE;
DEFINE.fetchUrl = JSON.stringify('tidy-api.andrewmessier.com');

module.exports = merge(base.base, {
	mode: "production",

	output: {
		filename: "[name].[chunkhash].js",
	},

	optimization: {
		minimize: true
	},

	plugins: [
		new webpack.DefinePlugin({ __DEFINE__: DEFINE }),
		// Change the module id (unique identifier) to go by path instead of number, so hash names change less often.
		new webpack.HashedModuleIdsPlugin(),
		new HTMLWebpackPlugin(base.html),
	]
});