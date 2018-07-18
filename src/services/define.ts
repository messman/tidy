// These definitions are set in your webpack config.
// Will fail if not set proerly in the webpack config.

declare let webpack: { [key: string]: any };

export const DEFINE = {
	BUILD: {
		IS_PRODUCTION: webpack.BUILD.IS_PRODUCTION as boolean,
		TIME: webpack.BUILD.TIME as string
	}
};

// Make these public on the window for us to easily check
(window as any)["DEFINE"] = DEFINE;