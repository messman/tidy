import * as React from "react";
import styled, { css, StyledFC } from "@/styles/theme";
import { FlexColumn } from "@/unit/components/flex";
import { FlattenSimpleInterpolation } from "styled-components";


interface CustomCSSFlexColumnProps {
	customCSS: FlattenSimpleInterpolation;
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
	fillWithOverlay: boolean
}

export const BackgroundFill: React.FC<BackgroundFillProps> = (props) => {

	let backgroundCss: FlattenSimpleInterpolation = null;

	if (props.fillWithSidebar) {
		backgroundCss = css`
			background-color: red;
		`;
	}
	else if (props.fillWithOverlay) {
		backgroundCss = css`
			background-color: blue;
		`;
	}

	return (
		<StyledCustomCSSFlexColumn customCSS={backgroundCss}>
			{props.children}
		</StyledCustomCSSFlexColumn>
	);
}


