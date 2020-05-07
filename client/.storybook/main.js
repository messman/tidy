const path = require("path");
const getDefine = require('../define');
const webpack = require("webpack");

// https://storybook.js.org/docs/configurations/typescript-config/
module.exports = {

	stories: ['../src/storybook/**/*.story.tsx'],

	webpackFinal: async function (config) {

		const DEFINE = await getDefine(true, true);

		config.module.rules.push({
			test: /\.(ts|tsx|tsx)$/,
			use: [
				{
					loader: require.resolve('ts-loader'),
				}
			],
		});
		config.resolve.extensions.push('.ts', '.tsx');

		// Taken from regular webpack build
		config.resolve.alias['@'] = path.resolve(__dirname, '../src')

		config.plugins.push(new webpack.DefinePlugin({ __DEFINE__: DEFINE }));

		return config;
	}
};