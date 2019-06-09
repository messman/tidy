import * as React from "react";
import styled, { StyledFC } from "@/styles/theme";
import { WindowDimensions } from "@/unit/hooks/useWindowDimensions";
import { ResponsiveLayoutType } from "@/unit/hooks/useResponsiveLayout";

export function pickLayout(dimensions: WindowDimensions): ResponsiveLayoutType {
	// TODO: maybe we can pass previous dimensions or previous layout here? To prevent any jarring stuff
	if (dimensions.width > 1400) {
		return ResponsiveLayoutType.wide;
	}
	return ResponsiveLayoutType.compact;
}

interface ResponsiveLayoutProps {
	layout: ResponsiveLayoutType,

	header?: JSX.Element,
	timeline?: JSX.Element,
	footer?: JSX.Element,
	longTerm?: JSX.Element,
	about?: JSX.Element,
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = (props) => {

	const header = props.header || <DebugView>Header {props.layout}</DebugView>
	const timeline = props.timeline || <DebugView>Timeline</DebugView>
	const longTerm = props.longTerm || <DebugView>Long Term</DebugView>
	const about = props.about || <DebugView>About</DebugView>
	const footer = props.footer || <p>Footer</p>

	let layoutElements: JSX.Element = null;
	if (props.layout === ResponsiveLayoutType.compact) {
		layoutElements = (
			<>
				<Flex>{header}</Flex>
				<Flex>{timeline}</Flex>
			</>
		);
	}
	else if (props.layout === ResponsiveLayoutType.regular) {
		layoutElements = (
			<>
				<Flex>{header}</Flex>
				<Flex>{timeline}</Flex>
			</>
		);
	}
	else if (props.layout === ResponsiveLayoutType.wide) {
		layoutElements = (
			<FlexRow>
				<FlexColumn flex={2} >
					<Flex>{header}</Flex>
					<Flex>{timeline}</Flex>
				</FlexColumn>
				<Flex>{longTerm}</Flex>
			</FlexRow>
		);
	}

	return (
		<Root>
			<FlexColumn>
				{layoutElements}
				{footer}
			</FlexColumn>
		</Root>
	);
}



interface FlexProps {
	flex?: number | "none";
}

const Flex = styled.div<FlexProps>`
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

const Root = styled(FlexColumn)`
	height: 100%;
	width: 100%;
`


const Filler = styled.div`
	height: 100%;
	width: 100%;
	padding: 1rem;
`;

const Border = styled.div`
	height: 100%;
	width: 100%;
	border: 1px solid ${props => props.theme.color.layerLight};
`;

const DebugView: React.FC = (props) => {
	return (
		<Filler>
			<Border>Debug {props.children}</Border>
		</Filler>
	);
}