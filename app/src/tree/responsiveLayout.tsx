import * as React from "react";
import styled from "@/styles/theme";
import { WindowDimensions } from "@/unit/hooks/useWindowDimensions";
import { ResponsiveLayoutType } from "@/unit/hooks/useResponsiveLayout";
import { Flex, FlexColumn, FlexRow } from "@/unit/components/flex";

export function pickLayout(dimensions: WindowDimensions): ResponsiveLayoutType {
	// TODO: maybe we can pass previous dimensions or previous layout here? To prevent any jarring stuff
	if (dimensions.width > 1200) {
		return ResponsiveLayoutType.wide;
	}
	return ResponsiveLayoutType.compact;
}

interface ResponsiveLayoutProps {
	layout: ResponsiveLayoutType,
	fillWithSidebar: boolean,
	fillWithOverlay: boolean,

	header?: JSX.Element,
	timeline?: JSX.Element,
	footer?: JSX.Element,
	sidebar?: JSX.Element,
	overlay?: JSX.Element,
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = (props) => {

	const header = props.header || <DebugView>Header {props.layout}</DebugView>
	const timeline = props.timeline || <DebugView>Timeline</DebugView>
	const longTerm = props.sidebar || <DebugView>Long Term</DebugView>
	const about = props.overlay || <DebugView>About</DebugView>
	const footer = props.footer || <p>Footer</p>

	let layoutElements: JSX.Element = null;
	if (props.fillWithOverlay) {
		layoutElements = about;
	}
	else if (props.fillWithSidebar) {
		layoutElements = longTerm;
	}
	else if (props.layout === ResponsiveLayoutType.compact) {
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
				{longTerm}
			</FlexRow>
		);
	}

	return (
		<FlexColumn>
			{layoutElements}
			{footer}
		</FlexColumn>
	);
}





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