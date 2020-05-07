const yargs = require('yargs');
const tidyServer = require("tidy-server");
const jsStringify = require("javascript-stringify");

module.exports = async function (isDevelopment, forceLocalTestData) {

	const buildTime = (new Date()).getTime();
	const packageJson = require('./package.json');
	const buildVersion = packageJson.version;

	/*
		Should match code in the source directory.
		Note, when using DefinePlugin, webpack will parse the JS, not do a simple find-and-replace.
	*/
	const DEFINE = {
		buildVersion: JSON.stringify(buildVersion),
		buildTime: JSON.stringify(buildTime),

		// Overwritten by dev/prod builds
		localTestData: JSON.stringify(null),
		fetchUrl: JSON.stringify(null)
	};

	if (isDevelopment) {
		DEFINE.fetchUrl = JSON.stringify('http://localhost:8000/latest');

		// Check for passing of a command line flag.
		// Either from package.json, with --data or --data=...
		// or from command line with -- --data or -- --data=...
		const testData = forceLocalTestData || yargs.argv['data'];
		if (testData) {
			// If no value, it's true. Otherwise, it's the string value.
			const testDataString = testData === true ? 'default' : `'${testData}'`;
			console.log(`Adding local test data: ${testDataString}`);

			// Default to wells config.
			const wellsConfiguration = tidyServer.createWellsConfiguration();
			const response = await tidyServer.getAllTestForConfiguration(wellsConfiguration, testData === true ? null : testData);

			// Stringify to JS code.
			DEFINE.localTestData = jsStringify.stringify(response);
		}
	}
	else {
		DEFINE.fetchUrl = JSON.stringify('tidy-api.andrewmessier.com');
	}

	return DEFINE;
}