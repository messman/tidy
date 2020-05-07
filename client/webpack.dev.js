console.log("~~~~~ DEVELOPMENT build ~~~~~");

const webpack = require("webpack");
const merge = require("webpack-merge");
const base = require("./webpack.base.js");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const getDefine = require('./define');

module.exports = async () => {

	const DEFINE = await getDefine(true, false);

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