import { AllResponse } from 'tidy-shared';

/*
	These definitions are set in the webpack config and resolved at build time.
 */

declare let webpack: { [key: string]: any };

export const DEFINE = {
	buildVersion: webpack.buildVersion as string,
	buildTime: webpack.buildTime as number,
	localTestData: webpack.localTestData as AllResponse,
	fetchUrl: webpack.fetchUrl as string
};

// Make these public on the window for us to easily check
(window as any)["DEFINE"] = DEFINE;