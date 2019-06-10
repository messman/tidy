import baseStyled, { css as baseCss, ThemedStyledInterface, BaseThemedCssFunction, createGlobalStyle, ThemeProps, FlattenInterpolation } from "styled-components";
export { ThemeProvider } from "styled-components";

export const theme = {
	color: {
		bgDark: "#1E416A",
		bgMed: "#44658C",
		bgLight: "#BFCDDD",
		emphasis: "#CEB740",
		layerDark: "#4777AE",
		layerMed: "#6399D6",
		layerLight: "#D3E1F2",
	},
	fontFamily: `'Nunito', sans-serif`
}

export const GlobalAppStyles = createGlobalStyle`
	
	html {
		font-family: ${theme.fontFamily};
		font-weight: 400;
	}
	
	body {
		background-color: ${theme.color.bgDark};
		color: ${theme.color.layerLight};
	}

	html, body, #react-root {
		margin: 0;
		padding: 0;
		height: 100%;
	}

	* {
		box-sizing: border-box;
	}
`;

// Export theme type
export type Theme = typeof theme;

// Export wrapped styled
const styled = baseStyled as ThemedStyledInterface<Theme>;
export default styled;

// Export wrapped css
export const css = baseCss as BaseThemedCssFunction<Theme>;
export type ThemedCSS = FlattenInterpolation<ThemeProps<Theme>>;

export type StyledFC<T> = React.FC<T & { className?: string }>;