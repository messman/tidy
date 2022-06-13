// @ts-check
// Note: @types/webpack is installed to ensure webpack 5 types are used in js type checking.
const path = require('path');
const webpack = require('webpack');
const createStyledComponentsTransformer = require('typescript-plugin-styled-components').default;
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
const CopyPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const getDefine = require('./define');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const isDevelopment = !envToBool('PROD');
const isCosmos = envToBool('COSMOS');
const isBundleAnalysis = envToBool('ANALYZE');

function envToBool(variableName) {
	const variable = process.env[variableName] || process.env[variableName.toLowerCase()];
	return !!variable && variable.toLowerCase() === 'true';
}

/**
 * @typedef { import('webpack').Configuration } Configuration
 */

/**
 * Creates the webpack config for three scenarios:
 * - Development (testing with development server)
 * - React Cosmos (development)
 * - Deploy (production, possibly with bundle analysis)
 */
module.exports = async () => {

	console.log([
		isDevelopment ? 'Development' : 'Production',
		isCosmos ? 'Cosmos' : '',
		isBundleAnalysis ? 'Bundle Analysis' : ''
	].filter(x => !!x).join(', '));

	/** @type { Configuration['mode'] } */
	const mode = isDevelopment ? 'development' : 'production';
	/** @type { Configuration['devtool'] } */
	const devtool = isDevelopment ? 'source-map' : false;

	/** @type { Configuration['entry'] } */
	const entry = {
		index: './src/entry/entry-index.tsx'
	};
	/** @type { Configuration['output'] } */
	const output = {
		// Template for naming bundles
		// https://webpack.js.org/guides/caching/
		filename: isDevelopment ? '[name].js' : '[name].[contenthash].js',
		// Template for naming code-split bundles
		chunkFilename: 'chunk.[name].js',
		hashDigestLength: 10,
		path: path.resolve(__dirname, './dist'),

	};

	/** @type { Configuration['optimization'] } */
	/*
		https://webpack.js.org/plugins/split-chunks-plugin/
		TODO: We'll see if this actually changes anything...
	*/
	const optimization = {
		splitChunks: {
			chunks: 'all'
		},
		moduleIds: 'deterministic'
	};

	/** @type { Configuration['stats'] } */
	const stats = {
		assets: !isDevelopment,
		modules: !isDevelopment,
		errorDetails: false,
		errorStack: false,
		assetsSort: '!size',
	};

	/** @type { Configuration['resolve'] } */
	const resolve = {
		// Add '.ts' and '.tsx' as resolvable extensions (so that you don't need to type out the extension yourself).
		extensions: ['.ts', '.tsx', '.js', '.json'],
		alias: {
			'@': path.resolve(__dirname, './src')
		},
	};

	const compilerOptions = isCosmos ? ({
		sourceMap: true,
		declaration: false,
		declarationMap: false,
		skipLibCheck: true,
		incremental: false
	}) : undefined;

	/** @type { Configuration['module'] } */
	const module = {
		rules: [
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: [
								['@babel/preset-env', {
									debug: false,
									// Test with npx browserslist '[query]'
									targets: '> 2% in US, last 2 safari versions, not ie <= 11',
									// #REF_BABEL_COMPILE
									/*
										By default, babel will do transformations, but won't add polyfills.
										In order to add polyfills, we need to add two packages for runtime (regenerator-runtime, corejs).
										And the settings below tell babel to add imports for the polyfills in 
										our code so that at runtime the imported polyfill functions are defined by those package.
										Info: https://stackoverflow.com/a/61517521 and https://github.com/babel/babel/issues/9849
											and https://babeljs.io/docs/en/babel-preset-env#corejs
									*/
									useBuiltIns: 'usage',
									corejs: '3.20',
								}],
								'@babel/preset-react'
							],
							// Cache won't work, since it's part of the webpack pipeline.
							cacheDirectory: false,
							cacheCompression: false
						}
					},
					{
						loader: 'ts-loader',
						options: {
							getCustomTransformers: () => ({ before: [createStyledComponentsTransformer()] }),
							onlyCompileBundledFiles: !isCosmos, // Keep the default of false in Cosmos, or build time will double.
							transpileOnly: isDevelopment, // Set to true to test speed without type-checking.
							compilerOptions: compilerOptions
						}
					}
				]
			}
		]
	};

	/** @type {any} */
	const forkCheckerPlugin = new ForkTsCheckerWebpackPlugin({
		// https://github.com/TypeStrong/fork-ts-checker-webpack-plugin#options
		formatter: 'basic'
	});

	/** @type {any} */
	const cleanWebpackPlugin = new CleanWebpackPlugin();
	/** @type {any} */
	const copyPlugin = new CopyPlugin({
		patterns: [
			{ from: 'src/static/images', to: './' },
			{ from: 'src/static/favicons', to: './' },
		]
	});

	const DEFINE = await getDefine(isDevelopment);
	/** @type {any} */
	const definePlugin = new webpack.DefinePlugin({ __DEFINE__: DEFINE });

	/** @type {any} */
	const htmlPlugin = new HTMLWebpackPlugin({
		filename: './index.html',
		template: './src/index.template.ejs',
		minify: false,
		xhtml: true, // Use XHTML-compliance
		cache: false // https://github.com/webpack/webpack/issues/10761
	});

	/** @type {any} */
	const bundleAnalyzerPlugin = new BundleAnalyzerPlugin({
		analyzerMode: 'disabled', // Don't open the server automatically
		generateStatsFile: isBundleAnalysis // Create a stats file
	});

	/////////////////////////////////////////////////
	// Set configuration
	/////////////////////////////////////////////////

	/** @type { Configuration } */
	let config = {};

	if (!isDevelopment) {
		// Production
		config = {
			mode,
			devtool,
			entry,
			output,
			stats,
			optimization,
			resolve,
			module,
			plugins: [
				cleanWebpackPlugin,
				copyPlugin,
				definePlugin,
				htmlPlugin,
				bundleAnalyzerPlugin
			]
		};
	}
	else if (!isCosmos) {
		// Development
		config = {
			mode,
			devtool,
			entry,
			output,
			stats,
			optimization,
			resolve,
			module,
			plugins: [
				cleanWebpackPlugin,
				copyPlugin,
				definePlugin,
				htmlPlugin,
				forkCheckerPlugin
			]
		};
	}
	else {
		// Cosmos
		config = {
			mode,
			devtool,
			// No entry
			// No output
			stats,
			resolve,
			module,
			plugins: [
				copyPlugin,
				definePlugin,
				htmlPlugin,
				forkCheckerPlugin
			]
		};
	}

	return config;
};