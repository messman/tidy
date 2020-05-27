import * as React from 'react';
import { createGlobalStyle, ThemeProps, ThemeProvider } from 'styled-components';
import { SmallTextInline } from '@/core/symbol/text';
import { keyFactory, useLocalStorage, UseLocalStorageReturn } from '@/services/data/local-storage';
import { borderRadiusStyle, edgePaddingValue } from './common';
import { styled } from './styled';

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
		link: '#2575BF',
		disabled: '#6B6B6B',
		tide: '#145C9E',
		sun: '#EAC435',
		weather: '#1282A2',
		context: '#A63446',
		warning: '#EAC435',
		error: '#A63446',
		backgroundTimelineDay: '#111111'
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
		background: '#FEFCFB',
		backgroundLighter: '#F0F0F0',
		backgroundLightest: '#DDDDDD',
		textAndIcon: '#1B1B1B',
		disabled: '#737373',
		backgroundTimelineDay: '#F8F8F8',
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
		font-weight: 300;
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
		vertical-align: top;
		-webkit-text-size-adjust: 100%;
		box-sizing: border-box;
		z-index: 1;
	}
`;

const LocalStorageThemeContext = React.createContext<UseLocalStorageReturn<number>>(null!);

const getKey = keyFactory('tidy');
const themeIndexKey = getKey('themeIndex');

export const LocalStorageThemeProvider: React.FC = (props) => {
	const localStorageReturn = useLocalStorage(themeIndexKey, 0, (value) => {
		return !!themes[value];
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
	return themes[themeIndex];
};

export const ThemePicker: React.FC = () => {

	const [themeIndex, setThemeIndex] = useLocalStorageTheme();

	function onClick(index: number): void {
		setThemeIndex(index);
	}

	const options = themes.map((theme, index) => {
		return (
			<ThemePickerOption
				key={theme.name}
				name={theme.name}
				index={index}
				isSelected={index === themeIndex}
				onClick={onClick}
			/>
		);
	});

	return (
		<ThemePickerBubble>
			{options}
		</ThemePickerBubble>
	);
};

const ThemePickerBubble = styled.div`
	display: inline-block;
	font-size: 0;

	background-color: ${p => p.theme.color.backgroundLighter};
	padding: ${edgePaddingValue};
	${borderRadiusStyle}
`;

interface ThemePickerOptionProps {
	name: string,
	isSelected: boolean,
	index: number,
	onClick: (index: number) => void;
}

const ThemePickerOption: React.FC<ThemePickerOptionProps> = (props) => {

	function onClick(): void {
		if (!props.isSelected) {
			props.onClick(props.index);
		}
	}

	return (
		<ThemePickerOptionBubble isSelected={props.isSelected} onClick={onClick}>
			<SmallTextInline>{props.name.toUpperCase()}</SmallTextInline>
		</ThemePickerOptionBubble>
	);
};

interface ThemePickerOptionBubbleProps {
	isSelected: boolean;
}

const ThemePickerOptionBubble = styled.div<ThemePickerOptionBubbleProps>`
	display: inline-block;
	font-size: 0;

	min-width: 3.5rem;
	text-align: center;
	background-color: ${p => p.isSelected ? p.theme.color.context : 'transparent'};
	padding: calc(${edgePaddingValue} / 3) ${edgePaddingValue};
	${borderRadiusStyle}
	cursor: pointer;
`;