import styled from 'styled-components';
import { borderRadiusStyle, Spacing } from '../primitive/primitive-design';
import { themeTokens } from '../theme';
import { fontStyles } from './text-shared';

export const Note = styled.div`
	${fontStyles.text.small};
	color: ${themeTokens.text.distinct};
	padding: ${Spacing.cat12};
	background-color: ${themeTokens.note.background};
	${borderRadiusStyle};
	border: 1px solid ${themeTokens.note.outline};
`;