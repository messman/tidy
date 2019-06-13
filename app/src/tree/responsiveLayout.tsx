import * as React from "react";
import styled from "@/styles/theme";
import { WindowDimensions } from "@/unit/hooks/useWindowDimensions";
import { Flex, FlexColumn, FlexRow } from "@/unit/components/flex";


export enum ResponsiveLayoutType {
	compact = 0,
	regular = 500,
	wide = 1200
}

const layoutKeys = Object.keys(ResponsiveLayoutType).filter(function (key) {
	return isNaN(parseInt(key, 10));
}).reverse();

export function pickLayout(dimensions: WindowDimensions): number {
	return ResponsiveLayoutType[layoutKeys.find(function (key) {
		return dimensions.width > ResponsiveLayoutType[key];
	})];
}

export function getLayoutRange(layoutType: ResponsiveLayoutType): [number, number | null] {
	const index = layoutKeys.findIndex(function (key) {
		return ResponsiveLayoutType[key] === layoutType;
	});
	return [ResponsiveLayoutType[layoutKeys[index]], index === 0 ? null : ResponsiveLayoutType[layoutKeys[index - 1]]]
}

interface ResponsiveLayoutProps {
	layout: ResponsiveLayoutType,
	fillWithSidebar: boolean,
	fillWithOverlay: boolean,

	header: JSX.Element,
	timeline?: JSX.Element,
	footer: JSX.Element,
	sidebar: JSX.Element,
	overlay: JSX.Element,
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = (props) => {
	const { header, timeline, sidebar, overlay, footer } = props;

	let layoutElements: JSX.Element = null;
	if (props.fillWithOverlay) {
		layoutElements = overlay;
	}
	else if (props.fillWithSidebar) {
		layoutElements = sidebar;
	}
	else if (props.layout === ResponsiveLayoutType.compact || props.layout === ResponsiveLayoutType.regular) {
		layoutElements = (
			<>
				{header}
				{timeline}
			</>
		);
	}
	else if (props.layout === ResponsiveLayoutType.wide) {
		layoutElements = (
			<FlexRow>
				<FlexColumn flex={1.8} >
					{header}
					{timeline}
				</FlexColumn>
				{sidebar}
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