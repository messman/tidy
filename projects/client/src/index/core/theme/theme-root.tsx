import * as React from 'react';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { isObjectLiteral } from '@wbtdevlocal/iso';
import { localStore } from '../data/local-storage';
import { fontDefaultSize, fontFamily, FontWeight } from '../primitive/primitive-design';
import { lightTokens } from './theme-instances';
import { ThemeInfo } from './theme-types';

/*
	We use CSS variables (https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
	to swap between light and dark themes.

	We apply potentially multiple major versions of the design system at once. We'll need to translate the design tokens into
	strings that define the variables, like:
	--var-1: #fff;
	--var-2: #000;
	for each version (with a version prefix).


*/
const lightTheme: ThemeInfo = {
	name: 'Light',
	isDark: false,
	variableDefinitions: createCssVariableDefinition(lightTokens, '')
};

/**
 * Use in components to reference styles. You do not need to grab them from the theme prop.
 * 
 * ```
 * const style = css`
 *   color: ${themeTokens....text.distinct};
 * `;
 * ```
*/
export const themeTokens = createCssVariableValue(lightTokens, '');

// Note: overscroll-behavior comes from https://stackoverflow.com/a/50846937 to prevent macs going back (since we have horizontal scroll)
export const GlobalStyles = createGlobalStyle`
	:root, :before, :after {
		${p => p.theme.variableDefinitions};
	}

	html, body, #react-root, #root {
		margin: 0;
		padding: 0;
		height: 100%;
		overflow: hidden;
		
		overscroll-behavior: none;
	}

	html {
		font-family: ${fontFamily};
		font-weight: ${FontWeight.regular};
		font-size: ${fontDefaultSize};
		box-sizing: border-box;
		// #REF_BROWSER_STYLE
		// Background-color here is to cover notches and other browser-covered areas
		background: ${themeTokens.background.base};
		color: ${themeTokens.text.distinct};

		// https://itnext.io/make-your-pwas-look-handsome-on-ios-fd8fdfcd5777
		padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left) !important;
		min-height: calc(100% + env(safe-area-inset-top)) !important;
	}
	
	body {
	}
	
	#react-root, #root {
		// #REF_BROWSER_STYLE
		background: ${themeTokens.background.gradient};
	}

	* {
		vertical-align: top;
		-webkit-text-size-adjust: 100%;
		-webkit-font-smoothing: antialiased;
  		-moz-osx-font-smoothing: grayscale;
	}

	*, *:before, *:after {
		box-sizing: inherit;
	}
`;

export enum ThemeMode {
	light = 'light',
	dark = 'dark',
	system = 'system'
}

export interface LocalStorageTheme {
	mode: ThemeMode;
	// variant
}

export interface ApplicationTheme {
	mode: ThemeMode;
	themeInfo: ThemeInfo;
	isPreferringSystemDark: boolean;
}

export type ApplicationThemeContext = [ApplicationTheme, (value: LocalStorageTheme | undefined) => void];

const ThemeContext = React.createContext<ApplicationThemeContext>(null!);

export const ThemeContextProvider: React.FC<React.PropsWithChildren> = (props) => {
	// Detecting system preference: https://stackoverflow.com/a/57795495

	const [isPreferringSystemDark, setIsPreferringSystemDark] = React.useState<boolean>(() => {
		return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
	});

	React.useEffect(() => {
		function onChange(media: MediaQueryListEvent) {
			setIsPreferringSystemDark(media.matches);
		}
		const matchMedia = window.matchMedia('(prefers-color-scheme: dark)');
		matchMedia.addEventListener('change', onChange);
		return () => {
			matchMedia.removeEventListener('change', onChange);
		};
	}, []);

	const [localStorageTheme, setLocalStorageTheme] = localStore.useLocalStorage<LocalStorageTheme>('theme', (value) => {
		if (value === undefined) {
			// If not stored or no longer valid, go with system.
			return { mode: ThemeMode.system };
		}
		return value;
	});

	const themeInfo = React.useMemo<ThemeInfo>(() => {
		if (localStorageTheme.mode === ThemeMode.system) {
			//return isPreferringSystemDark ? darkTheme : lightTheme; // TODO - when dark mode is added use this line
			return lightTheme; // Delete
		}
		else if (localStorageTheme.mode === ThemeMode.dark) {
			//return darkTheme; // TODO - when dark mode is added use this line
			return lightTheme; // Delete
		}
		return lightTheme;
	}, [localStorageTheme, isPreferringSystemDark]);

	const value = React.useMemo<ApplicationThemeContext>(() => {
		return [{
			mode: localStorageTheme.mode,
			themeInfo,
			isPreferringSystemDark
		}, setLocalStorageTheme];
	}, [isPreferringSystemDark, localStorageTheme, themeInfo, setLocalStorageTheme]);

	return (
		<ThemeContext.Provider value={value}>
			<ThemeProvider theme={themeInfo}>
				<>
					<GlobalStyles />
					{props.children}
				</>
			</ThemeProvider>
		</ThemeContext.Provider>
	);
};

export const useApplicationTheme = () => React.useContext(ThemeContext);

function createCssVariableDefinition(tokens: {}, prefix: string): string {
	let variables: string[] = [];
	const keys = Object.keys(tokens);
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];
		const keyString = `${prefix}-${key}`;
		const value = tokens[key as keyof {}];
		if (isObjectLiteral(value)) {
			variables.push(createCssVariableDefinition(value, keyString));
		}
		else {
			variables.push(`--${keyString}: ${value};`);
		}
	}
	return variables.join('\n');
}

function createCssVariableValue<T extends object>(tokens: T, prefix: string): T {
	const output = {} as T;
	const keys = Object.keys(tokens);
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i] as keyof T;
		const keyString = `${prefix}-${key as string}`;
		const value = tokens[key] as any;
		if (isObjectLiteral(value)) {
			output[key] = createCssVariableValue(value, keyString);
		}
		else {
			output[key] = `var(--${keyString})` as any;
		}
	}
	return output;
}