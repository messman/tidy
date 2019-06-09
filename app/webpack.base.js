const path = require("path");

const CopyPlugin = require('copy-webpack-plugin');

const buildTime = (new Date()).getTime();
const version = "1.1.0"; // AGM_QT_V

// Cleans a directory
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const htmlPluginOptions = {
	title: "Quick-Tides",
	filename: "./index.html",
	template: "./src/index.template.ejs",
	minify: false,
	xhtml: true, // Use XHTML-compliance
	user: {
		buildTime: buildTime,
		version: version
	}
};

/*
	Note, when using DefinePlugin, webpack will parse the JS, not do a simple find-and-replace.
	so "webpack" should not be a variable, but instead just a TS interface or "declare let" or similar.
*/
const DEFINE = {
	webpack: {
		BUILD: {
			IS_PRODUCTION: JSON.stringify(true),
			VERSION: JSON.stringify(version),
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
		filename: "[name].js",
		hashDigestLength: 10,
		path: path.resolve(__dirname, "./dist")
	},

	resolve: {
		// Add '.ts' and '.tsx' as resolvable extensions (so that you don't need to type out the extension yourself).
		extensions: [".ts", ".tsx", ".js", ".json"],
	},

	module: {
		rules: [
			// All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader' and then 'babel-loader'.
			// ts-loader: convert typescript to javascript (tsconfig.json)
			// babel-loader: converts javascript to javascript (es5) (.babelrc)
			{
				test: /\.tsx?$/,
				loaders: ["babel-loader", "ts-loader"]
			},
		]
	},

	plugins: [
		// Clean the output folder each time
		new CleanWebpackPlugin(),
		new CopyPlugin([
			// Copy to output folder, but then go one up
			{ from: 'src/static/favicons', to: './' },
		]),
	]
};

module.exports = {
	html: htmlPluginOptions,
	base: baseWebpackOptions,
	DEFINE
};