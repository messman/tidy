const tidyServer = require('tidy-server');
const jsStringify = require('javascript-stringify');

module.exports = async function getDefine(isDevelopment) {

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
		isDevelopment: JSON.stringify(isDevelopment),

		// Overwritten by dev/prod builds
		localTestData: JSON.stringify(null),
		fetchUrl: JSON.stringify(null),
	};

	if (isDevelopment) {
		DEFINE.fetchUrl = JSON.stringify('http://localhost:8000/latest');

		/*
			Below is code to create test data right now as part of the build process.
			This 'local' test data is inserted directly into the building code via Webpack's Define plugin.
			
			The 'phrase' determines what the test data looks like - it is used as the seed for the randomizer.
			
			The application uses localStorage to detect whether local data or fetched data was last used and will persist that choice across refreshes.
			The settings page can be used to make a new choice.
		*/
		const localTestDataPhrases = ['Apple', 'Bronco', 'Caesar', 'Drum', 'Elk', 'Fragrance', 'Gingerbread', 'Halo']
		console.log(`Adding local test data...`, localTestDataPhrases);

		const localTestDataMap = {};
		for (let i = 0; i < localTestDataPhrases.length; i++) {
			const phrase = localTestDataPhrases[i];
			localTestDataMap[phrase] = await createLocalTestData(phrase);
		}
		// Stringify to JS code, which prevents issues with Date objects (see shared code).
		DEFINE.localTestData = jsStringify.stringify(localTestDataMap);
		console.log(`Done adding local test data`);
	}
	else {
		DEFINE.fetchUrl = JSON.stringify('tidy-api.andrewmessier.com');
	}

	return DEFINE;
}

async function createLocalTestData(phrase) {
	// Default to wells config.
	const wellsConfiguration = tidyServer.createWellsConfiguration();
	return await tidyServer.getAllTestForConfiguration(wellsConfiguration, phrase);
}
