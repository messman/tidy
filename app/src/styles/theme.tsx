import baseStyled, { css as baseCss, ThemedStyledInterface, BaseThemedCssFunction, createGlobalStyle } from "styled-components";

export const theme = {
	color: {
		black: "black",
	},
	fontFamily: `monospace`
}

export const GlobalAppStyles = createGlobalStyle`
	body {
		background-color: ${() => theme.color.black} !important;
	}
`;

// Export theme type
export type Theme = typeof theme;

// Export wrapped styled
const styled = baseStyled as ThemedStyledInterface<Theme>;
export default styled;

// Export wrapped css
export const css = baseCss as BaseThemedCssFunction<Theme>;