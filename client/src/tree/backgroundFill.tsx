import * as React from "react";
import styled, { StyledFC, ThemedCSS } from "@/styles/styled";
import { FlexColumn } from "@/unit/components/flex";

interface CustomCSSFlexColumnProps {
	customCSS: ThemedCSS;
}

const _CustomCSSFlexColumn: StyledFC<CustomCSSFlexColumnProps> = (props) => {
	return <FlexColumn className={props.className}>{props.children}</FlexColumn>;
}

const StyledCustomCSSFlexColumn = styled(_CustomCSSFlexColumn)`
	/* transition: background-color 100ms linear; */
	/* background-color: transparent; */
	${props => props.customCSS}
`;

export interface BackgroundFillProps {
	fillWithSidebar: boolean,
	sidebarCss: ThemedCSS,
	fillWithOverlay: boolean
	overlayCss: ThemedCSS,
}

export const BackgroundFill: React.FC<BackgroundFillProps> = (props) => {

	let backgroundCss: ThemedCSS = null!;

	if (props.fillWithSidebar) {
		backgroundCss = props.sidebarCss;
	}
	else if (props.fillWithOverlay) {
		backgroundCss = props.overlayCss;
	}

	return (
		<StyledCustomCSSFlexColumn customCSS={backgroundCss}>
			{props.children}
		</StyledCustomCSSFlexColumn>
	);
}


