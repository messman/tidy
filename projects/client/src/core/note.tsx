import styled from 'styled-components';
import { fontStyleDeclarations } from './text';
import { borderRadiusStyle, Spacing } from './theme/box';

export const Note = styled.div`
	${fontStyleDeclarations.bodySmall};
	color: ${p => p.theme.textDistinct};
	padding: ${Spacing.cat12};
	background-color: ${p => p.theme.note.background};
	${borderRadiusStyle};
	border: 1px solid ${p => p.theme.note.outline};
`;