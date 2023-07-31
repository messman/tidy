/*
	Helps us add custom properties to external types.
	See https://medium.com/rbi-tech/theme-with-styled-components-and-typescript-209244ec15a3
*/

import { ThemeInfo } from '@/index/core/theme/theme-types';

declare module 'styled-components' {
	export interface DefaultTheme extends ThemeInfo { }
}