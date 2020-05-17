import * as React from 'react';
import { styled } from '@/core/style/styled';

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
	flex?: number | string;
}

export const Flex = styled.div<FlexProps>`
	position: relative;
	flex: ${p => p.flex};
`;

Flex.defaultProps = {
	flex: 1
}

interface FlexParentProps extends FlexProps {
	/**
	 * Default: row
	 */
	flexDirection?: 'row' | 'column';
	/**
	 * Row: how items act vertically. Column: how items act horizontally.
	 * Default: stretch
	 */
	alignItems?: 'stretch' | 'center';
	/**
	 * How items work along the direction of row/column. Default: flex-start.
	 * Default: flex-start
	 * */
	justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
}

export const FlexParent = styled(Flex) <FlexParentProps>`
	display: flex;
	flex-direction: ${p => p.flexDirection};
	align-items: ${p => p.alignItems};
	justify-content: ${p => p.justifyContent};
`;

FlexParent.defaultProps = {
	flexDirection: 'row',
	alignItems: 'stretch',
	justifyContent: 'flex-start'
};

export const FlexRoot = styled(FlexParent)`
	height: 100%;
	width: 100%;
`;

export const FlexColumn = styled(FlexParent)``;
FlexColumn.defaultProps = {
	flexDirection: 'column'
};

export const FlexRow = styled(FlexParent)``;
FlexRow.defaultProps = {
	flexDirection: 'row'
};