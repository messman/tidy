console.log("~~~~~ PRODUCTION build ~~~~~");

const webpack = require("webpack");

const merge = require("webpack-merge");
const base = require("./webpack.base.js");

// Creates the HTML file for you
const HTMLWebpackPlugin = require("html-webpack-plugin");

// Add the ExtractTextPlugin to move CSS out into their own files
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const extractSass = new ExtractTextPlugin({
	filename: "index.css",
});

const totalHTMLPluginOptions = merge(base.html,
	{
		title: "Quick-Tides"
	});

const DEFINE = base.DEFINE;
DEFINE.webpack.BUILD.IS_PRODUCTION = JSON.stringify(true);

module.exports = merge(base.base, {

	// Enable sourcemaps for debugging webpack's output. Increases build time - faster options are available.
	devtool: "source-map",

	output: {
		filename: "[name].[chunkhash].js",
	},

	module: {
		rules: [
			{
				test: /\.scss$/,
				use: extractSass.extract({
					use: [{
						loader: "css-loader" // Translates CSS into JS
					}, {
						loader: "sass-loader" // Compiles SCSS
					}],
					fallback: "style-loader" // Create styles from JS strings
				})
			}
		]
	},

	plugins: [
		new webpack.DefinePlugin(DEFINE),
		new webpack.optimize.UglifyJsPlugin({
			sourceMap: true
		}),
		// Change the module id (unique identifier) to go by path instead of number, so hash names change less often.
		new webpack.HashedModuleIdsPlugin(),
		extractSass,
		new HTMLWebpackPlugin(totalHTMLPluginOptions),
	]
});