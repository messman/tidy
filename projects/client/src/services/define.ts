import { AllResponse, deserialize } from 'tidy-shared';

/*
	These definitions are set in the webpack config and resolved at build time.
 */

declare let __DEFINE__: { [key: string]: any };

let localTestDataSerialized = __DEFINE__.localTestData as { [phrase: string]: string } | null;
let localTestData: { [phrase: string]: AllResponse } | null = null;
if (localTestDataSerialized) {
	localTestData = {};
	Object.keys(localTestDataSerialized).forEach((key) => {
		localTestData![key] = deserialize(localTestDataSerialized![key]);
	});
}

export const DEFINE = {
	buildVersion: __DEFINE__.buildVersion as string,
	buildTime: __DEFINE__.buildTime as number,
	isDevelopment: __DEFINE__.isDevelopment as boolean,
	localTestData: localTestData,
	fetchUrl: __DEFINE__.fetchUrl as string
};

// Make these public on the window for us to easily check
(window as any)['DEFINE'] = DEFINE;