const path = require("path");
const webpack = require("webpack");

module.exports = {
	entry: "./src/index.js",
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "bundle.js"
	},
	module: {
		rules: [
			{
				test: /\.scss$/,
				loaders: [
					"style-loader", // Create styles from JS strings
					"css-loader", // Translates CSS into JS
					"sass-loader", // Compiles SCSS
				]
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: "babel-loader"
			}
		]
	},
	devtool: "source-map"
};