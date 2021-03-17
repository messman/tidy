const webpack = require('webpack');
const WebpackMerge = require('webpack-merge');
const base = require('./webpack.base.js');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const getDefine = require('./define');

module.exports = async () => {

	const DEFINE = await getDefine(false);

	return WebpackMerge.merge(base.base, {
		mode: 'production',

		output: {
			// https://webpack.js.org/guides/caching/
			filename: '[name].[contenthash].js',
			path: path.resolve(__dirname, '../../docs') // GitHub Pages
		},

		optimization: {
			moduleIds: 'hashed',
			minimize: true,
			splitChunks: {
				cacheGroups: {
					vendor: {
						test: /[\\/]node_modules[\\/]/,
						name: 'vendors',
						chunks: 'all',
					},
				},
			},
		},

		stats: {
			assets: true,
			assetsSort: '!size'
		},

		plugins: [
			new webpack.DefinePlugin({ __DEFINE__: DEFINE }),
			// Change the module id (unique identifier) to go by path instead of number, so hash names change less often.
			new webpack.HashedModuleIdsPlugin(),
			new HTMLWebpackPlugin(base.html),
		]
	});

};