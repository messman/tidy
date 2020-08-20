import * as React from 'react';
import { createGlobalStyle, ThemeProps, ThemeProvider } from 'styled-components';
import { localStorage } from '@/services/data/local-storage';
import { UseLocalStorageReturn } from '@messman/react-common';

/** Custom application theme type. */
export interface Theme {
	name: string,
	color: {
		/** Background */
		background: string,
		/** Lighter version of background, used for layout components. */
		backgroundLighter: string,
		/** Lightest version of background, used for UI components. */
		backgroundLightest: string,

		/** All our text and icons that aren't superseded by another color. */
		textAndIcon: string,

		/** Color of text links. */
		link: string,

		/** Color of text or icons or other components that are disabled. */
		disabled: string,

		/** Color used for tide information. */
		tide: string,

		/** Color used for sun information. */
		sun: string,

		/** Color used for weather information. */
		weather: string,

		/** Color used for contextual app action. */
		context: string,

		/** Color used for warning information. */
		warning: string,

		/** Color used for error information. */
		error: string,

		/** Color used specifically for separation of timeline days */
		backgroundTimelineDay: string,

		/** Color used specifically for grays in weather icons to match better with backgrounds. */
		weatherIconGray: string,
	};
	fontFamily: string;
}

/** The dark theme */
const darkTheme: Theme = {
	name: 'dark',
	color: {
		background: '#0A0A0A',
		backgroundLighter: '#161616',
		backgroundLightest: '#2B2B2B',
		textAndIcon: '#C0C0C0',
		link: '#2575BF',
		disabled: '#6B6B6B',

		tide: '#346EA4',
		sun: '#C8A218',
		weather: '#32938D',

		context: '#434343',
		warning: '#DEB317',
		error: '#7E1D2D',
		backgroundTimelineDay: '#111111',
		weatherIconGray: '#DEDEDE'
	},
	fontFamily: `'Work Sans', sans-serif;`
};

/** The light theme */
const lightTheme: Theme = {
	...darkTheme,
	name: 'light',
	color: {
		...darkTheme.color,

		// Overrides
		background: '#F7F7F7',
		backgroundLighter: '#ECECEC',
		backgroundLightest: '#DDDDDD',
		textAndIcon: '#1F1F1F',
		disabled: '#737373',
		context: '#C4C4C4',
		error: '#E34E66',
		backgroundTimelineDay: '#EFEFEF',
		weatherIconGray: '#BBBBBB'
	}
};

// Index is stored in LocalStorage
export const themes: Theme[] = [darkTheme, lightTheme];

// For some reason, VS Code is not happy to colorize the CSS in this block when `createGlobalStyle` is used with a type.
// Note: '#root' is for storybook
// Note: overscroll-behavior comes from https://stackoverflow.com/a/50846937 to prevent macs going back (since we have horizontal scroll)
export const GlobalStyles = createGlobalStyle<ThemeProps<Theme>>`
	html {
		font-family: ${p => p.theme.fontFamily};
		font-weight: 400;
	}
	
	body {
		background-color: ${p => p.theme.color.background};
		color: ${p => p.theme.color.textAndIcon};
	}

	html, body, #react-root, #root {
		margin: 0;
		padding: 0;
		height: 100%;

		overscroll-behavior: none;
	}

	* {
		font-weight: 400;
		vertical-align: top;
		-webkit-text-size-adjust: 100%;
		box-sizing: border-box;
		z-index: 1;
	}
`;

const LocalStorageThemeContext = React.createContext<UseLocalStorageReturn<number>>(null!);

export const LocalStorageThemeProvider: React.FC = (props) => {

	const localStorageReturn = localStorage.useLocalStorage<number>('themeIndex', (value) => {
		// If not stored or no longer valid, go with the first option.
		if (value === undefined || !themes[value]) {
			return 0;
		}
		return value;
	});
	const [themeIndex] = localStorageReturn;
	const theme = themes[themeIndex];

	return (
		<LocalStorageThemeContext.Provider value={localStorageReturn}>
			<ThemeProvider theme={theme}>
				<>
					<GlobalStyles />
					{props.children}
				</>
			</ThemeProvider>
		</LocalStorageThemeContext.Provider>
	);
};

export const useLocalStorageTheme = () => React.useContext(LocalStorageThemeContext);
export const useCurrentTheme = () => {
	const [themeIndex] = React.useContext(LocalStorageThemeContext);
	return themes[themeIndex!];
};