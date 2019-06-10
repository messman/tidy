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
	alignItems?: "stretch" | "center";
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
`;

FlexColumn.defaultProps = {
	alignItems: "stretch"
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
`;

FlexRow.defaultProps = {
	alignItems: "stretch"
};