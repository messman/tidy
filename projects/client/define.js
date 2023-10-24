// @ts-check
module.exports = function getDefine(isDevelopment) {

	const buildTime = (new Date()).getTime();
	const packageJson = require('./package.json');
	const buildVersion = packageJson.version;

	// Version of the server API to use.
	const apiOrigin = isDevelopment ? '' : 'https://wellsbeachtime-v2023-api-fa95c2c9d3f7.herokuapp.com/'; // #REF_API_CONNECTION
	const apiRoot = apiOrigin + '/api';

	/*
		Should match code in the source directory.
		Note, when using DefinePlugin, webpack will parse the JS, not do a simple find-and-replace.
	*/
	const DEFINE = {
		buildVersion: JSON.stringify(buildVersion),
		buildTime: JSON.stringify(buildTime),
		isDevelopment: JSON.stringify(isDevelopment),
		apiRoot: JSON.stringify(apiRoot),
		clientKey: JSON.stringify("2023.10.23"), // #REF_CLIENT_KEY
	};
	return DEFINE;
};