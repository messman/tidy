import baseStyled, { css as baseCss, ThemedStyledInterface, BaseThemedCssFunction, createGlobalStyle } from "styled-components";

export const theme = {
	color: {
		bg: "white",
	},
	fontFamily: `monospace`
}

export const GlobalAppStyles = createGlobalStyle`
	body {
		font-family: ${theme.fontFamily};
		background-color: ${theme.color.bg};
	}
`;

// Export theme type
export type Theme = typeof theme;

// Export wrapped styled
const styled = baseStyled as ThemedStyledInterface<Theme>;
export default styled;

// Export wrapped css
export const css = baseCss as BaseThemedCssFunction<Theme>;