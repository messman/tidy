import * as React from "react";
import styled from "@/styles/styled";
import { WindowDimensions } from "@/unit/hooks/useWindowDimensions";
import { FlexColumn, FlexRow } from "@/unit/components/flex";


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
		return dimensions.width > ResponsiveLayoutType[key as keyof typeof ResponsiveLayoutType];
	}) as keyof typeof ResponsiveLayoutType];
}

export function getLayoutRange(layoutType: ResponsiveLayoutType): [number, number | null] {
	const index = layoutKeys.findIndex(function (key) {
		return ResponsiveLayoutType[key as keyof typeof ResponsiveLayoutType] === layoutType;
	});
	return [ResponsiveLayoutType[layoutKeys[index] as keyof typeof ResponsiveLayoutType], index === 0 ? null : ResponsiveLayoutType[layoutKeys[index - 1] as keyof typeof ResponsiveLayoutType]]
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

	let layoutElements: JSX.Element = null!;
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
				<StrongFlexColumn flex={1.8} >
					{header}
					{timeline}
				</StrongFlexColumn>
				<SidebarWrapper>
					{sidebar}
				</SidebarWrapper>
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


const StrongFlexColumn = styled(FlexColumn)`
	overflow: hidden;
`;

const SidebarWrapper = styled(FlexColumn)`
	border-left: 2px solid ${props => props.theme.color.background};
	width: 600px;
	flex: initial;
`;