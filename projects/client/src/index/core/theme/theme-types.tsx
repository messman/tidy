/** Properties passed in to styled-components as the "DefaultTheme" type for the theme provider. */
export interface ThemeInfo {
	/** Like 'Basic Light' or 'Basic Dark' */
	name: string;
	/** Is it a dark theme? */
	isDark: boolean;
	/** The variable definitions for the global style. */
	variableDefinitions: string;
}