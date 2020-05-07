import * as React from "react";
import { createContext, useContext } from "react";
import { createGlobalStyle, ThemeProps, ThemeProvider } from "styled-components";
import { useLocalStorage, UseLocalStorageReturn } from "@/unit/hooks/useLocalStorage";
import { keyFactory } from "@/services/localStorage";

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
	};
	fontFamily: string;
}

/** The dark theme */
const darkTheme: Theme = {
	name: 'dark',
	color: {
		background: '#0A0A0A',
		backgroundLighter: '#1B1B1B',
		backgroundLightest: '#2B2B2B',
		textAndIcon: '#D8D8D8',
		tide: '#145C9E',
		sun: '#EAC435',
		weather: '#1282A2',
		context: '#A63446',
		warning: '#EAC435',
		error: '#A63446',
		backgroundTimelineDay: '#111111'
	},
	fontFamily: `'Work Sans', sans-serif;`
}

/** The "dark" theme, based off the default. */
const lightTheme: Theme = {
	...darkTheme,
	name: 'light',
	color: {
		...darkTheme.color,

		// Overrides
		background: '#FEFCFB',
		backgroundLighter: '#F0F0F0',
		backgroundLightest: '#DDDDDD',
		textAndIcon: '#1B1B1B',
		backgroundTimelineDay: '#F8F8F8',
	}
};

// Index is stored in LocalStorage
export const themes: Theme[] = [darkTheme, lightTheme];

// For some reason, VS Code is not happy to colorize the CSS in this block when `createGlobalStyle` is used with a type.
export const GlobalAppStyles = createGlobalStyle<ThemeProps<Theme>>`
	html {
		font-family: ${p => p.theme.fontFamily};
		font-weight: 300;
	}
	
	body {
		background-color: ${p => p.theme.color.background};
		color: ${p => p.theme.color.textAndIcon};
	}

	html, body, #react-root {
		margin: 0;
		padding: 0;
		height: 100%;
	}

	* {
		-webkit-text-size-adjust: 100%;
		box-sizing: border-box;
		z-index: 1;
	}
`;

const LocalStorageThemeContext = createContext<UseLocalStorageReturn<number>>(null!);

const getKey = keyFactory('tidy');
const themeIndexKey = getKey('themeIndex');

export const LocalStorageThemeProvider: React.FC = (props) => {

	const localStorageReturn = useLocalStorage(themeIndexKey, 0);
	const [themeIndex] = localStorageReturn;
	const theme = themes[themeIndex];

	return (
		<LocalStorageThemeContext.Provider value={localStorageReturn}>
			<ThemeProvider theme={theme}>
				<>
					<GlobalAppStyles />
					{props.children}
				</>
			</ThemeProvider>
		</LocalStorageThemeContext.Provider>
	);
}

export const useLocalStorageTheme = () => useContext(LocalStorageThemeContext);