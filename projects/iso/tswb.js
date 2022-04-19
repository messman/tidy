// @ts-check
const webpack = require('webpack');
/**
 * @typedef { import('@messman/ts-webpack-builder').LibraryBuildOptions } LibraryBuildOptions
 */
/**
 * @type Partial<LibraryBuildOptions>
 */
const options = {
	webpackConfigTransform: (webpackConfig, buildOptions) => {

		const buildTime = (new Date()).getTime();
		const packageJson = require('./package.json');
		const buildVersion = packageJson.version;

		/*
			Should match code in the source directory.
			Note, when using DefinePlugin, webpack will parse the JS, not do a simple find-and-replace.
		*/
		const DEFINE = {
			buildVersion: JSON.stringify(buildVersion),
			buildTime: JSON.stringify(buildTime),
			isDevelopment: JSON.stringify(buildOptions.isDevelopment)
		};

		webpackConfig.plugins.push(new webpack.DefinePlugin({ __DEFINE__: DEFINE }));
		return webpackConfig;
	}

};

module.exports = options;