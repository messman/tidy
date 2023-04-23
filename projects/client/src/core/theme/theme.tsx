// import * as React from 'react';
// import { createGlobalStyle, ThemeProps, ThemeProvider as StyledThemeProvider } from 'styled-components';
// import { localStorage } from '@/services/data/local-storage';
// import { UseLocalStorageReturn } from '@messman/react-common';
// import { baseLightTheme, Theme } from './color';
// import { fontFamily, FontSize, FontWeight } from './font';

// export const themesMap = {
// 	//baseDark: baseDarkTheme,
// 	baseLight: baseLightTheme
// };

// // Index is stored in LocalStorage
// export const themes: Theme[] = [/*baseDarkTheme,*/ baseLightTheme];

// // For some reason, VS Code is not happy to colorize the CSS in this block when `createGlobalStyle` is used with a type.
// // Note: overscroll-behavior comes from https://stackoverflow.com/a/50846937 to prevent macs going back (since we have horizontal scroll)
// export const GlobalStyles = createGlobalStyle<ThemeProps<Theme>>`
// 	html {
// 		font-family: ${fontFamily};
// 		font-weight: ${FontWeight.regular};
// 		font-size: ${FontSize.body};
// 		box-sizing: border-box;
// 	}
	
// 	body {
// 		background-color: ${themeTokens.gradient.light};
// 		background: linear-gradient(172.75deg, ${themeTokens.gradient.light} 10.5%, ${themeTokens.gradient.dark} 84.5%);
// 		color: ${themeTokens.textDistinct};
// 	}

// 	html, body, #react-root, #root {
// 		margin: 0 !important;
// 		padding: 0 !important;
// 		height: 100%;

// 		overscroll-behavior: none;
// 	}

// 	* {
// 		vertical-align: top;
// 		-webkit-text-size-adjust: 100%;
// 		-webkit-font-smoothing: antialiased;
//   		-moz-osx-font-smoothing: grayscale;
// 	}

// 	*, *:before, *:after {
// 		box-sizing: inherit;
// 	}
// `;

// const ThemeContext = React.createContext<UseLocalStorageReturn<number>>(null!);

// export const ThemeContextProvider: React.FC<React.PropsWithChildren> = (props) => {
// 	const localStorageReturn = localStorage.useLocalStorage<number>('themeIndex', (value) => {
// 		// If not stored or no longer valid, go with the first option.
// 		if (value === undefined || !themes[value]) {
// 			return 0;
// 		}
// 		return value;
// 	});
// 	const [themeIndex] = localStorageReturn;
// 	const theme = themes[themeIndex];

// 	return (
// 		<ThemeContext.Provider value={localStorageReturn}>
// 			<StyledThemeProvider theme={theme}>
// 				<>
// 					<GlobalStyles />
// 					{props.children}
// 				</>
// 			</StyledThemeProvider>
// 		</ThemeContext.Provider>
// 	);
// };

// export const useThemeIndex = () => React.useContext(ThemeContext);