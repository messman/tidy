console.log("~~~~~ DEVELOPMENT build ~~~~~");

const webpack = require("webpack");

const merge = require("webpack-merge");
const base = require("./webpack.base.js");

// Creates the HTML file for you
const HTMLWebpackPlugin = require("html-webpack-plugin");

const totalHTMLPluginOptions = merge(base.html,
	{
		title: "Quick-Tides (Dev)"
	}
);

module.exports = merge(base.base, {
	mode: "development",

	devtool: "cheap-module-source-map",

	devServer: {
		port: 8888,
		contentBase: false,
		open: "google chrome"
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
			}
		]
	},

	plugins: [
		// Set our flags / DEFINEs
		new webpack.DefinePlugin(base.DEFINE),
		// Generate the HTML for us
		new HTMLWebpackPlugin(totalHTMLPluginOptions)
	]
});