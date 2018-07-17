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

	devtool: "cheap-module-source-map",

	devServer: {
		port: 8888,
		publicPath: "./dist/",
		contentBase: "./"
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
		// Change the module id (unique identifier) to go by path instead of number, so hash names change less often.
		new webpack.NamedModulesPlugin(),
		// Generate the HTML for us
		new HTMLWebpackPlugin(totalHTMLPluginOptions)
	]
});