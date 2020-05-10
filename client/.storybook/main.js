const path = require("path");
const getDefine = require('../define');
const webpack = require("webpack");
const createStyledComponentsTransformer = require("typescript-plugin-styled-components").default;

// https://storybook.js.org/docs/configurations/typescript-config/
module.exports = {

	stories: ['../src/storybook/**/*.story.tsx'],

	addons: ['@storybook/addon-viewport/register'],

	webpackFinal: async function (config) {

		const DEFINE = await getDefine(true, true);

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
						loader: '@svgr/webpack'
					}
				]
			});
		config.resolve.extensions.push('.ts', '.tsx');

		// Taken from regular webpack build
		config.resolve.alias['@'] = path.resolve(__dirname, '../src')

		config.plugins.push(new webpack.DefinePlugin({ __DEFINE__: DEFINE }));

		return config;
	}
};