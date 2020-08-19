const path = require("path");
const getDefine = require('../define');
const webpack = require("webpack");
const createStyledComponentsTransformer = require("typescript-plugin-styled-components").default;

// https://storybook.js.org/docs/configurations/typescript-config/
module.exports = {

	stories: ['../src/**/*.story.tsx'],

	addons: ['@storybook/addon-viewport/register', '@storybook/addon-knobs/register'],

	webpackFinal: async function (config) {

		const DEFINE = await getDefine(true);

		config.module.rules = [];
		config.module.rules.push(
			{
				test: /\.(ts|tsx)$/,
				use: [
					{
						loader: require.resolve('ts-loader'),
						options: {
							getCustomTransformers: () => ({ before: [createStyledComponentsTransformer()] })
						}
					}
				],
			},
			{
				test: /\.svg$/,
				use: [
					{
						loader: '@svgr/webpack',
						options: {
							// Allows us to customize the icons using 'color'. See icon code.
							replaceAttrValues: { '#000': 'currentColor' },
							dimensions: false,
							svgoConfig: {
								plugins: {
									removeViewBox: false
								}
							}
						}
					}
				]
			});
		config.resolve.extensions.push('.ts', '.tsx');

		// Taken from regular webpack build
		config.resolve.alias['@'] = path.resolve(__dirname, '../src');

		config.plugins.push(new webpack.DefinePlugin({ __DEFINE__: DEFINE }));

		//console.dir(config, { depth: null });

		return config;
	}
};