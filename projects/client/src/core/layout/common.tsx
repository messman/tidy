import { styled } from '../style/styled';
import { FlexColumn, FlexRow } from './flex';
import { LayoutBreakpoint } from '@/services/layout/responsive-layout';

/** A flex column whose width is the screen width, not the width decided by flex rules. */
export const ScreenWidthFlexColumn = styled(FlexColumn)`
	width: 100vw;
	max-width: ${LayoutBreakpoint.regular}px;
`;

/** A flex column whose width is the Regular Layout Breakpoint Size. */
export const RegularWidthFlexColumn = styled(FlexColumn)`
	width: ${LayoutBreakpoint.regular}px;
`;

/** A Flex Row that has overflow: auto, so it scrolls if its width is greater than its parent. */
export const OverflowAutoFlexRow = styled(FlexRow)`
	overflow: auto;
`;