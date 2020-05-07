import { addons } from '@storybook/addons';

//import { themes } from '@storybook/theming';
// addons.setConfig({
// 	theme: themes.dark,
// });

import yourTheme from './customTheme';
addons.setConfig({
	theme: yourTheme,
});