const path = require("path");

const webpack = require("webpack");

const buildTime = (new Date()).toString();

// Cleans a directory
const CleanWebpackPlugin = require("clean-webpack-plugin");

const htmlPluginOptions = {
	title: "Quick-Tides",
	filename: "../index.html",
	template: "./src/index.template.ejs",
	minify: false,
	xhtml: true, // Use XHTML-compliance
	user: {
		buildTime: buildTime
	}
};

/*
	Note, when using DefinePlugin, webpack will parse the JS, not do a simple find-and-replace.
	so "webpack" should not be a variable, but instead just a TS interface or "declare let" or similar.
*/
const DEFINE = {
	webpack: {
		BUILD: {
			IS_PRODUCTION: JSON.stringify(false),
			TIME: JSON.stringify(buildTime)
		},
		DEBUG: {
			LOCAL_REQUEST_DATA: JSON.stringify(true)
		}
	}
}

const baseWebpackOptions = {
	entry: {
		index: "./src/views/index.tsx",
		vendor: [
			"react",
			"react-dom",
		]
	},
	output: {
		filename: "[name].[chunkhash].js",
		hashDigestLength: 10,
		path: path.resolve(__dirname, "./dist"),
		publicPath: "./dist/"
	},

	resolve: {
		// Add '.ts' and '.tsx' as resolvable extensions (so that you don't need to type out the extension yourself).
		extensions: [".ts", ".tsx", ".js", ".json"],

		// Resolve imports from node_modules or src
		modules: ["node_modules", "src"]
	},

	module: {
		rules: [
			// All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader' and then 'babel-loader'.
			// ts-loader: convert typescript to javascript (tsconfig.json)
			// babel-loader: converts javascript to javascript (es5) (.babelrc)
			{
				test: /\.tsx?$/,
				exclude: ["./node_modules/"],
				loaders: ["babel-loader", "ts-loader"]
			},
		]
	},

	plugins: [
		// Clean the "dist" folder each time
		new CleanWebpackPlugin(["./dist"], /*{ watch: true }*/),
		// Filter out all the vendor libraries and put that in its own chunk
		new webpack.optimize.CommonsChunkPlugin({
			name: "vendor"
		}),
		// Filter out all the "Webpack" manifest code and put that in its own chunk
		new webpack.optimize.CommonsChunkPlugin({
			name: "runtime"
		})
	]
};

module.exports = {
	html: htmlPluginOptions,
	base: baseWebpackOptions,
	DEFINE
};