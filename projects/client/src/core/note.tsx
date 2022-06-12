import { fontStyleDeclarations } from './text';
import { borderRadiusStyle, Spacing } from './theme/box';
import { styled } from './theme/styled';

export const Note = styled.div`
	${fontStyleDeclarations.bodySmall};
	color: ${p => p.theme.textSubtle};
	padding: ${Spacing.dog16};
	background-color: ${p => p.theme.note.background};
	${borderRadiusStyle};
	border: 1px solid ${p => p.theme.note.outline};
`;