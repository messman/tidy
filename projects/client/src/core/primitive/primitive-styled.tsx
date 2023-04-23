import * as React from 'react';
import { DefaultTheme, FlattenInterpolation, FlattenSimpleInterpolation, StyledComponent, ThemeProps } from 'styled-components';

/* NOTE - importing from anywhere outside of primitive will cause circular dependency issues #REF_CIRC_DEPEND */

export type CssOutput = FlattenSimpleInterpolation | FlattenInterpolation<ThemeProps<DefaultTheme>>;

export interface ClassNameProps {
	className?: string;
}

/** Wrap around a props interface to add the className prop. */
export type Styled<P = {}> = P & ClassNameProps;

/** Used to apply to the end of attributes declarations. */
export type AttrsComponent<E extends keyof JSX.IntrinsicElements, P extends object = {}> = StyledComponent<E, any, P, never>;

/**
 * Indicates that the component handles the `className` prop if supplied (to make the elements within able to be styled)
 * 
 * Pattern:
 * const MyComponent_Unstyled: StyledFC<Props> = (props) => { ... };
 * export const MyComponent = styled(MyComponent_Unstyled)` ... `
 * 
 * Reference: https://styled-components.com/docs/advanced#caveat 
 * 
 * Unfortunately you cannot just inline the Unstyled component, because it breaks the syntax highlighting: https://github.com/styled-components/vscode-styled-components/blob/main/CONTRIBUTING.md#a-line-break-seems-to-break-the-syntax-highlighting
*/
export type StyledFC<P = {}> = React.FC<Styled<P>>;

/** Like {@link StyledFC}, but for ForwardRef components. */
export type StyledForwardRef<R, P = {}> = React.ForwardRefExoticComponent<React.PropsWithoutRef<P & ClassNameProps> & React.RefAttributes<R>>;