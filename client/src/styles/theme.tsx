import baseStyled, { css as baseCss, ThemedStyledInterface, BaseThemedCssFunction, createGlobalStyle, ThemeProps, FlattenInterpolation } from "styled-components";
export { ThemeProvider, keyframes } from "styled-components";

export interface Theme {
	color: {
		bgDark: string;
		bgMed: string;
		bgLight: string;
		emphasis: string;
		layerDark: string;
		layerMed: string;
		layerLight: string;
		skyUpper: string;
		skyLower: string;
	};
	fontFamily: string;
}


export const theme: Theme = {
	color: {
		bgDark: "#1E416A",
		bgMed: "#44658C",
		bgLight: "#BFCDDD",
		emphasis: "#CEB740",
		layerDark: "#4777AE",
		layerMed: "#6399D6",
		layerLight: "#D3E1F2",
		skyUpper: "#86B6ED",
		skyLower: "#C4DFFF"
	},
	fontFamily: `'Nunito', sans-serif`
}

export const GlobalAppStyles = createGlobalStyle`
	
	html {
		font-family: ${theme.fontFamily};
		font-weight: 200;
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
		z-index: 1
	}
`;

// Export wrapped styled
const styled = baseStyled as ThemedStyledInterface<Theme>;
export default styled;

// Export wrapped css
export const css = baseCss as BaseThemedCssFunction<Theme>;
export type ThemedCSS = FlattenInterpolation<ThemeProps<Theme>>;

export interface ClassNameProps {
	className?: string
}
export type StyledFC<P> = React.FC<P & ClassNameProps>;