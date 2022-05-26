// Config file for @messman/ts-webpack-builder
// @ts-check
const updateWebpackConfig = require('./webpack-config.js');

/**
 * @typedef { import('@messman/ts-webpack-builder').LibraryBuildOptions } LibraryBuildOptions
 */

/**
 * @type { Partial<LibraryBuildOptions> }
 */
const options = {
	libraryName: '@wbtdevlocal/assets',
	isNode: false,
	webpackConfigTransform: (webpackConfig, buildOptions) => {
		updateWebpackConfig(webpackConfig, buildOptions.isDevelopment);
		return webpackConfig;
	}
};

module.exports = options;