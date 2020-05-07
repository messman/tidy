import baseStyled, { css as baseCss, ThemedStyledInterface, BaseThemedCssFunction, ThemeProps, FlattenInterpolation } from "styled-components";
import { Theme } from "./theme";
export { ThemeProvider, keyframes } from "styled-components";

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