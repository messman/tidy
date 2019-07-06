import * as React from "react";
import styled, { StyledFC } from "@/styles/theme";

interface FlexProps {
	flex?: number | "none";
}

export const Flex = styled.div<FlexProps>`
	position: relative;
	flex: ${props => props.flex};
`;

Flex.defaultProps = {
	flex: 1
}

interface FlexContainerProps extends FlexProps {
	/** Row: how items act vertically. Column: how items act horizontally. */
	alignItems?: "stretch" | "center";
	/** How items work along the direction of row/column. Default: flex-start. */
	justifyContent?: "flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly";
}

const _FlexColumn: StyledFC<FlexContainerProps> = (props) => {
	return (
		<Flex className={props.className} flex={props.flex}>
			{props.children}
		</Flex>
	);
}

export const FlexColumn = styled(_FlexColumn)`
	display: flex;
	flex-direction: column;
	align-items: ${props => props.alignItems};
	justify-content: ${props => props.justifyContent};
`;

FlexColumn.defaultProps = {
	alignItems: "stretch",
	justifyContent: "flex-start"
};

const _FlexRow: StyledFC<FlexContainerProps> = (props) => {
	return (
		<Flex className={props.className} flex={props.flex}>
			{props.children}
		</Flex>
	);
}

export const FlexRow = styled(_FlexRow)`
	display: flex;
	flex-direction: row;
	align-items: ${props => props.alignItems};
	justify-content: ${props => props.justifyContent};
`;

FlexRow.defaultProps = {
	alignItems: "stretch",
	justifyContent: "flex-start"
};