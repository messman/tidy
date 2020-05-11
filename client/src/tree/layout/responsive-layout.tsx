import * as React from "react";
import { styled } from "@/styles/styled";
import { WindowDimensions } from "@/unit/hooks/layout/window-dimensions";
import { FlexColumn, FlexRow } from "@/unit/components/flex";
import { LayoutBreakpoint } from '@/unit/hooks/layout/responsive-layout';

const layoutKeys = Object.keys(LayoutBreakpoint).filter(function (key) {
	return isNaN(parseInt(key, 10));
}).reverse();

export function pickLayout(dimensions: WindowDimensions): number {
	return LayoutBreakpoint[layoutKeys.find(function (key) {
		return dimensions.width > LayoutBreakpoint[key as keyof typeof LayoutBreakpoint];
	}) as keyof typeof LayoutBreakpoint];
}

interface ResponsiveLayoutProps {
	layout: LayoutBreakpoint,
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
	else if (props.layout === LayoutBreakpoint.compact || props.layout === LayoutBreakpoint.regular) {
		layoutElements = (
			<>
				{header}
				{timeline}
			</>
		);
	}
	else if (props.layout === LayoutBreakpoint.wide) {
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