/*
	These definitions are set in the webpack config and resolved at build time.
 */
declare let __DEFINE__: { [key: string]: any; };

export const DEFINE = {
	buildVersion: __DEFINE__.buildVersion as string,
	buildTime: __DEFINE__.buildTime as number,
	isDevelopment: __DEFINE__.isDevelopment as boolean,
};

// Make these public on the window for us to easily check
(window as any)['DEFINE'] = DEFINE;