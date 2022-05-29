import { css } from './styled';

export const outlineStyle = css`
	outline: 2px dashed ${p => p.theme.common.focusOutline};
`;