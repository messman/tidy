const path = require('path');
const getDefine = require('../define');
const updateWebpackConfig = require('../webpack-common');


// Sourced from https://stackoverflow.com/a/47025043
// Documentation: https://nodejs.org/dist/latest-v14.x/docs/api/modules.html
const Module = require('module');
//const path = require('path');
function requireFrom(selfModule, directDependency, wantedDependency) {
	const resolvedPath = require.resolve(directDependency);
	// const resolvedPath = Module._resolveFilename(directDependency, selfModule);
	const depModule = new Module(resolvedPath, selfModule);
	depModule.filename = resolvedPath;
	const lookupPaths = Module._nodeModulePaths(path.dirname(resolvedPath));
	depModule.paths = lookupPaths;
	return depModule.require(wantedDependency);
}

// https://storybook.js.org/docs/configurations/typescript-config/
module.exports = {
	stories: ['../src/**/*.story.tsx'],
	addons: ['@storybook/addon-viewport', '@storybook/addon-knobs'],

	// Need to enable 'allowNamespaces' to prevent a babel issue in Storybook 6.1
	// "Non-declarative namespaces are only supported experimentally in Babel"
	// See https://github.com/storybookjs/storybook/issues/11218
	babel: async (options) => {
		const { presets } = options;
		const presetToMatch = '@babel/preset-typescript';
		for (let i = 0; i < presets.length; i++) {
			const preset = presets[i];
			// Preset is either string or tuple.
			if (typeof preset === 'string' && preset.indexOf(presetToMatch) !== -1) {
				// String
				presets[i] = [
					preset,
					{
						allowNamespaces: true,
					}
				];
				break;
			}
			if (Array.isArray(preset) && preset[0] && preset[0].indexOf(presetToMatch) !== -1) {
				presets[i] = [
					preset[0],
					{
						...preset[1],
						allowNamespaces: true,
					}
				];
				break;
			}
		}
		return {
			...options,
		};
	},

	webpackFinal: async function (config) {

		const storybookWebpack = requireFrom(module, '@storybook/core', 'webpack');
		console.log('Using storybook webpack version ' + storybookWebpack.version);

		updateWebpackConfig(config, true, true);

		// Taken from regular webpack build
		config.resolve.alias['@'] = path.resolve(__dirname, '../src');

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
		config.resolve.symlinks = false;
		config.resolve.modules = [path.resolve('node_modules')];

		//console.dir(config, { depth: null });
		const DEFINE = await getDefine(true);
		config.plugins.push(new storybookWebpack.DefinePlugin({ __DEFINE__: DEFINE }));

		return config;
	}
};