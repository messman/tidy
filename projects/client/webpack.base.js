const path = require('path');
const updateWebpackConfig = require('./webpack-common');
const CopyPlugin = require('copy-webpack-plugin');

// Cleans a directory
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const htmlPluginOptions = {
	filename: './index.html',
	template: './src/index.template.ejs',
	minify: false,
	xhtml: true, // Use XHTML-compliance
};

const baseWebpackOptions = {
	entry: {
		index: './src/entry/entry-index.tsx'
	},
	output: {
		filename: '[name].js',
		hashDigestLength: 10,
		path: path.resolve(__dirname, './dist')
	},

	resolve: {
		// Add '.ts' and '.tsx' as resolvable extensions (so that you don't need to type out the extension yourself).
		extensions: ['.ts', '.tsx', '.js', '.json'],

		alias: {
			'@': path.resolve(__dirname, './src'),
		},

		// See https://webpack.js.org/configuration/resolve/#resolve
		/*
			Discussion on symlinks:
			https://github.com/webpack/webpack/issues/554
			https://github.com/webpack/webpack/issues/985
			(MIT) https://github.com/niieani/webpack-dependency-suite/blob/master/plugins/root-most-resolve-plugin.ts
			https://github.com/npm/npm/issues/14325#issuecomment-285566020
			https://stackoverflow.com/a/57231875

			The gist: Only one copy of a package will be used,
			unless the package versions are different.
		*/
		symlinks: false,
		modules: [path.resolve('node_modules')]
	},

	module: {
		rules: []
	},

	plugins: [
		// Clean the output folder each time
		new CleanWebpackPlugin(),
		new CopyPlugin({
			patterns: [
				{ from: 'src/static/favicons', to: './' },
				{ from: 'src/static/images', to: './' }
			]
		})
	]
};

// Apply module rules (shared with Storybook).
updateWebpackConfig(baseWebpackOptions, false, false);

module.exports = {
	html: htmlPluginOptions,
	base: baseWebpackOptions
};