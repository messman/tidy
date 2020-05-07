const path = require("path");


// https://storybook.js.org/docs/configurations/typescript-config/
module.exports = {

	stories: ['../src/storybook/**/*.story.tsx'],

	webpackFinal: async config => {
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

		return config;
	}
};