import { styled } from '../../theme/styled';

export const SubtleLine = styled.div`
	height: 1px;
	background-color: ${p => p.theme.outlineSubtle};
`;

export const DistinctLine = styled.div`
	height: 1px;
	background-color: ${p => p.theme.outlineDistinct};
`;