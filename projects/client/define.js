// @ts-check
module.exports = function getDefine(isDevelopment) {

	const buildTime = (new Date()).getTime();
	const packageJson = require('./package.json');
	const buildVersion = packageJson.version;

	// Version of the server API to use.
	const apiOrigin = isDevelopment ? '' : 'https://wellsbeachtime-api-v4-0.herokuapp.com';
	const apiRoot = apiOrigin + '/api';

	/*
		Should match code in the source directory.
		Note, when using DefinePlugin, webpack will parse the JS, not do a simple find-and-replace.
	*/
	const DEFINE = {
		buildVersion: JSON.stringify(buildVersion),
		buildTime: JSON.stringify(buildTime),
		isDevelopment: JSON.stringify(isDevelopment),
		apiRoot: JSON.stringify(apiRoot)
	};
	return DEFINE;
};