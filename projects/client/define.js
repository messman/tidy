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

	let fetchUrlBase = null;

	if (isDevelopment) {
		const tidyServer = require('tidy-server');
		const tidyShared = require('tidy-shared');
		fetchUrlBase = 'http://192.168.86.40:8000';

		/*
			Below is code to create test data right now as part of the build process.
			This 'local' test data is inserted directly into the building code via Webpack's Define plugin.
			
			The 'phrase' determines what the test data looks like - it is used as the seed for the randomizer.
			
			The application uses localStorage to detect whether local data or fetched data was last used and will persist that choice across refreshes.
			The settings page can be used to make a new choice.
		*/
		const localTestDataPhrases = ['Apple', 'Bronco', 'Caesar', 'Drum', 'Elk', 'Fragrance', 'Gingerbread', 'Halo'];
		console.log(`Adding local test data...`, localTestDataPhrases);

		const localTestDataMap = {};
		for (let i = 0; i < localTestDataPhrases.length; i++) {
			const phrase = localTestDataPhrases[i];
			localTestDataMap[phrase] = tidyShared.serialize(await createLocalTestData(tidyServer, phrase));
		}
		// Stringify to JS code, which prevents issues with Date objects (see shared code).
		DEFINE.localTestData = JSON.stringify(localTestDataMap);
		console.log(`Done adding local test data`);
	}
	else {
		fetchUrlBase = 'https://agm-tidy-server.herokuapp.com';
	}

	// Version of the server API to use.
	const serverVersion = 'v3.5.0';
	DEFINE.fetchUrl = JSON.stringify(`${fetchUrlBase}/${serverVersion}/latest`);

	return DEFINE;
};

async function createLocalTestData(tidyServer, phrase) {
	// Default to wells config.
	const wellsConfiguration = tidyServer.createWellsConfiguration();
	return await tidyServer.getAllTestForConfiguration(wellsConfiguration, {
		logging: {
			isActive: false,
			prefix: null
		},
		data: {
			seed: phrase
		},
		keys: {
			weather: null
		}
	});
}
