import * as React from 'react';
import baseStyled, { css as baseCss, FlattenInterpolation, ThemedCssFunction, ThemedStyledInterface, ThemeProps } from 'styled-components';
import { Theme } from './theme';

export { ThemeProvider, keyframes } from 'styled-components';
export type { StyledComponent } from 'styled-components';

// Export wrapped styled
export const styled = baseStyled as ThemedStyledInterface<Theme>;

// Export wrapped css
export const css = baseCss as ThemedCssFunction<Theme>;
export type ThemedCSS = FlattenInterpolation<ThemeProps<Theme>>;

export type ThemedProps<T> = ThemeProps<Theme> & T;

export interface ClassNameProps {
	className?: string;
}
export type StyledFC<P = {}> = React.FC<P & ClassNameProps>;

export type StyledForwardRef<R, P = {}> = React.ForwardRefExoticComponent<React.PropsWithoutRef<P & ClassNameProps> & React.RefAttributes<R>>;