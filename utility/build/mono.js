// @ts-check 
const nmb = require('@messman/node-mono-builder');

/** @type {nmb.Schema} */
const schema = {
	pathRoot: '../../projects',
	projects: {
		'assets': {
			path: './assets',
		},
		'client': {
			path: './client',
		},
		'iso': {
			path: './iso',
		},
		'server': {
			path: './server',
		},
		'server-http': {
			path: './server-http',
		},
	}
};
/** @type {string[]} */
// @ts-ignore
const args = process.argv;
// [0]node [1]/usr/src/utility/build... [2]...
const commands = args.slice(2);

/** @type {string} */
// @ts-ignore
const workingDirectory = process.cwd();

nmb.parse(commands, {
	options: {
		currentDirectory: workingDirectory
	},
	schema: schema
});