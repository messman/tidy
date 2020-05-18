import baseStyled, { css as baseCss, ThemedStyledInterface, ThemeProps, FlattenInterpolation, ThemedCssFunction } from 'styled-components';
import { Theme } from './theme';
export { ThemeProvider, keyframes } from 'styled-components';

// Export wrapped styled
export const styled = baseStyled as ThemedStyledInterface<Theme>;

// Export wrapped css
export const css = baseCss as ThemedCssFunction<Theme>;
export type ThemedCSS = FlattenInterpolation<ThemeProps<Theme>>;

export interface ClassNameProps {
	className?: string
}
export type StyledFC<P> = React.FC<P & ClassNameProps>;