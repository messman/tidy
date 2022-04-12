import { addParameters } from '@storybook/react';

/*
	Default Viewports:
	- Small mobile = 320 x 568
	- Large mobile = 414 x 896
	- Tablet = 834 x 1112
*/

const customViewports = {
	mobileMin: {
		name: 'Mobile Min (iPhone SE)',
		styles: {
			width: '320px',
			height: '568px',
		},
	},
	mobileRegular: {
		name: 'Mobile Regular (iPhone X)',
		styles: {
			width: '375px',
			height: '812px',
		},
	},
	iPhone11: {
		name: 'iPhone 11',
		styles: {
			width: '414px',
			height: '896px',
		},
	},
	mobileLarge: {
		name: 'Mobile Large',
		styles: {
			width: '576px',
			height: '812px',
		},
	},
	tablet: {
		name: 'Tablet (iPad Mini 4)',
		styles: {
			width: '768px',
			height: '1024px',
		}
	},
	desktop: {
		name: 'Desktop',
		styles: {
			width: '992px',
			height: '1100px',
		}
	},
	iPadPro: {
		name: 'iPad Pro',
		styles: {
			width: '1024px',
			height: '1366px',
		}
	},
	wide: {
		name: 'Wide',
		styles: {
			width: '1200px',
			height: '1500px',
		}
	},
	max: {
		name: 'Max',
		styles: {
			width: '1500px',
			height: '1800px',
		}
	}
};

addParameters({
	layout: 'fullscreen',
	options: {
	},
	viewport: {
		viewports: {
			...customViewports,
		},
	}
});