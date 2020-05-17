const path = require('path');

const CopyPlugin = require('copy-webpack-plugin');
const createStyledComponentsTransformer = require('typescript-plugin-styled-components').default;

// Cleans a directory
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const htmlPluginOptions = {
	filename: './index.html',
	template: './src/index.template.ejs',
	minify: false,
	xhtml: true, // Use XHTML-compliance
};

const baseWebpackOptions = {
	entry: {
		index: './src/entry/entry-index.tsx'
	},
	output: {
		filename: '[name].js',
		hashDigestLength: 10,
		path: path.resolve(__dirname, './dist')
	},

	resolve: {
		// Add '.ts' and '.tsx' as resolvable extensions (so that you don't need to type out the extension yourself).
		extensions: ['.ts', '.tsx', '.js', '.json'],

		alias: {
			'@': path.resolve(__dirname, './src')
		}
	},

	module: {
		rules: [
			// All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader' and then 'babel-loader'.
			// ts-loader: convert typescript to javascript (tsconfig.json)
			// babel-loader: converts javascript to javascript (es5) (.babelrc)
			{
				test: /\.tsx?$/,
				use: [
					{
						loader: 'babel-loader'
					},
					{
						loader: 'ts-loader',
						options: {
							getCustomTransformers: () => ({ before: [createStyledComponentsTransformer()] })
						}
					}
				]
			},
			{
				test: /\.svg$/,
				use: [
					{
						loader: '@svgr/webpack',
						options: {
							svgoConfig: {
								plugins: {
									removeViewBox: false
								}
							}
						}
					}
				]
			}
		]
	},

	plugins: [
		// Clean the output folder each time
		new CleanWebpackPlugin(),
		new CopyPlugin([
			// Copy to output folder, but then go one up
			{ from: 'src/static/favicons', to: './' },
		]),
	]
};

module.exports = {
	html: htmlPluginOptions,
	base: baseWebpackOptions
};