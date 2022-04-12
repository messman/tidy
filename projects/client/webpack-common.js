/*
	Common between webpack and Storybook.
*/


// @ts-check
const createStyledComponentsTransformer = require('typescript-plugin-styled-components').default;

/**
 * @param {any} webpackConfig
 * @param {boolean} isDevelopment
 * @param {boolean} isStorybook
 * */
module.exports = function updateWebpackConfig(webpackConfig, isDevelopment, isStorybook) {

	const typeScriptBabelRule = {
		test: /\.tsx?$/,
		exclude: /node_modules/,
		use: [
			{
				loader: 'babel-loader',
				options: {
					presets: [['@babel/preset-env', { debug: false, targets: '> 2%, not ie <= 11' }], '@babel/preset-react'],
					// Cache won't work, since it's part of the webpack pipeline.
					cacheDirectory: false,
					cacheCompression: false
				}
			},
			{
				loader: 'ts-loader',
				options: {
					getCustomTransformers: () => ({ before: [createStyledComponentsTransformer()] }),
					onlyCompileBundledFiles: true,
					//transpileOnly: true,
				}
			}
		]
	};

	const svgRule = {
		// IF YOU CHANGE THIS SECTION, also update the storybook config.
		test: /\.svg$/,
		use: [
			{
				loader: '@svgr/webpack',
				options: {
					replaceAttrValues: { '#000': 'currentColor' },
					dimensions: false,
					svgoConfig: {
						plugins: {
							// Stops colors and heights from being removed.
							removeViewBox: false,
							removeUselessStrokeAndFill: false,
							removeUnknownsAndDefaults: false
						}
					}
				}
			}
		]
	};

	// Storybook 6 recommends not changing the Typescript/Babel config.
	// I guess that's okay, since there's nothing absolutely required in our custom config.
	if (isStorybook) {
		webpackConfig.module.rules = [typeScriptBabelRule, svgRule];
		return;
	}
	else {
		webpackConfig.module.rules = [typeScriptBabelRule, svgRule];
	}
};

