import { css, styled } from '../theme/styled';

/**
 * Essentially, when computing how large a scrollable container should be,
 * the browser cannot be sure whether to use height from parent or children.
 * If all ancestors have 'overflow: hidden', the 'overflow: auto' scrollable
 * container will be scrollable.
 */
export const overflowHiddenScrollStyle = css`
	overflow: hidden;
`;

/**
 * The top-level HTML element under the root.
 * Also used in the testing layout.
 */
export const ApplicationLayoutContainer = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	flex: 1;
	position: relative;
	width: 100%;
	height: 100%;
	${overflowHiddenScrollStyle};
`;