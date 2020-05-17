import { addons } from '@storybook/addons';

//import { themes } from '@storybook/theming';
// addons.setConfig({
// 	theme: themes.dark,
// });

import yourTheme from './custom-theme';
addons.setConfig({
	theme: yourTheme
});