// @ts-check
const webpack = require('webpack');

/**
 * @param {webpack.Configuration} webpackConfig
 * @param {boolean} isDevelopment
 * */
module.exports = function updateWebpackConfig(webpackConfig, isDevelopment) {

	/*
		Custom plugin that takes in the AST node of the SVG
		and changes the fill attribute.
		This requires a very specific icon construction in Figma.
		Something like:
		
		<svg ... viewBox=... fill="none" xmlns=...>
			<path ... d=... fill="black"/>
		</svg>

		Custom plugin API: https://github.com/svg/svgo
		internal AST: https://github.com/syntax-tree/xast

	*/
	function replaceSVGPathFillWithCurrentColor(ast, params, info) {
		if (!ast) {
			console.log('No AST', ast, info);
			return;
		}

		if (!params['_wbt']) {
			params['_wbt'] = { firstTime: true };
		}
		const storage = params['_wbt'];

		/*
			Note, May 2021: 
			As seen in the code elsewhere in this file, we run this replacement 
			function on the SVGs twice - once for generating the SVG urls, and again for
			the React components. The former requires svgo-loader, the latter @svgr/webpack.
			As of May 2021, svgo-loader updated to a new AST parser XAST.
			This code now handles the XAST way and the old way.
			New way uses 'name', old way uses 'elem'.
		*/
		const isOldParser = !!ast['elem'];
		const elementKey = isOldParser ? 'elem' : 'name';
		const attributesKey = isOldParser ? 'attrs' : 'attributes';

		const svgFile = (info && info['path']) || 'unknown';
		const isSvg = ast[elementKey] === 'svg';
		const isPath = ast[elementKey] === 'path';
		const attrs = ast[attributesKey];
		if ((!isSvg && !isPath) || !attrs) {

			// Write to console for a developer to inspect.
			// If this happens, it means the SVG is not constructed how we expected above.
			// Only print for the first instance (since this will otherwise log for every element of the SVG) and only the first time through.
			if (isOldParser && !storage[svgFile]) {
				storage[svgFile] = 1;
				const trimmedFileName = svgFile.substring(svgFile.indexOf('icons/') + 6);
				console.log('Complex structure: \'' + trimmedFileName + '\'');
			}
			return;
		}

		if (isSvg) {
			// Remove fill
			delete attrs['fill'];
		}
		else if (isPath) {
			const fill = attrs['fill'];

			let isSomethingWrong = false;
			if (isOldParser) {
				// Looks like { fill: { value: 'black' } }
				if (!fill || !fill.value) {
					isSomethingWrong = true;
				}
				else if (fill.value === 'black' || fill.value === '#000') {
					fill.value = 'currentColor';
				}
			}
			else {
				// Looks like { fill: 'black' }
				if (!fill) {
					isSomethingWrong = true;
				}
				else if (fill === 'black' || fill === '#000') {
					attrs['fill'] = 'currentColor';
				}
			}
			if (isSomethingWrong) {
				console.log('Path element does not have a fill to replace', svgFile);
			}
		}
	}
	const customPlugin = {
		name: 'Replace Fill Attribute',
		description: 'Replace Fill Attribute',
		type: 'perItem', // visitor, full, perItem or perItemReverse
		params: {},
		fn: replaceSVGPathFillWithCurrentColor
	};


	/*
		For some reason, svgo-loader thinks plugins are an array
		and svgr believes they are an object.
		(For what it's worth, I think svgo-loader is right.)
		So specify two options objects.
	*/


	const svgoOptionsForSVGO = {
		plugins: [
			// Stops colors and heights from being removed.
			{
				name: 'removeViewBox',
				active: false,
			},
			{
				name: 'removeUselessStrokeAndFill',
				active: false,
			},
			{
				name: 'removeUnknownsAndDefaults',
				active: false,
			},
			{
				name: 'removeDimensions',
				active: true,
			},
			customPlugin
		]
	};

	const svgoOptionsForSVGR = {
		plugins: {
			removeViewBox: false,
			removeUselessStrokeAndFill: false,
			removeUnknownsAndDefaults: false,
			removeDimensions: true,
			custom: customPlugin
		}
	};

	// ts-loader is present by default in ts-webpack-builder, but here we want to change some properties.
	webpackConfig.module.rules = [
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
								targets: '> 2% in US, last 2 safari versions, not ie <= 11',
								// #REF_BABEL_COMPILE
								// The settings below require certain packages at runtime in client/web.
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
				}
			]
		},
		{
			/*
				First SVG handler:
				use SVGR to load icons as React components.

				Note: We need two separate loader entries here because 
				SVGR doesn't rely on any transformations / loaders run before it.
				It needs to be passed its own SVGO config.
			*/
			test: /\.svg$/,
			exclude: /node_modules/,
			use: [
				{
					loader: '@svgr/webpack',
					options: {
						dimensions: false,
						svgoConfig: svgoOptionsForSVGR
					}
				},
			]
		},
		{
			/*
				Second SVG handler:
				use SVGO and file-loader to load icons as separate files.
				
			*/
			test: /\.svg$/,
			exclude: /node_modules/,
			use: [
				{
					// https://github.com/webpack-contrib/file-loader
					loader: 'file-loader',
					options: {
						/*
							Important! In Docker, volume bind mounts must
							not be in a host directory whose ancestors are deleted.
							Meaning, we can't have the icon files bound to /dist/icons
							because "dist" is deleted on build. It's okay that "icons"
							(or "dist-icons" in this case) is deleted. It just cannot be
							a parent.
						*/
						outputPath: '../dist-icons',
						publicPath: 'icons'
					}
				},
				{
					// https://github.com/svg/svgo-loader
					loader: 'svgo-loader',
					options: svgoOptionsForSVGO
				}
			]
		},
	];
};