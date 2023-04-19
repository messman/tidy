import { css } from 'styled-components';

export const outlineStyle = css`
	outline: 2px dashed ${p => p.theme.common.focusOutline};
`;