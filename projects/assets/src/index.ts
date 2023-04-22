/*
	Webpack 5 means this export will still have tree-shaking.
	https://webpack.js.org/blog/2020-10-10-webpack-5-release/#nested-tree-shaking
	https://medium.com/unsplash/named-namespace-imports-7345212bbffb
*/
export * as icons from './icon-manifest';
export * from './icon-require';