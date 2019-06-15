import * as React from "react";
import { Flex, FlexRow, FlexColumn } from "@/unit/components/flex";
import styled, { css, ThemedCSS, StyledFC } from "@/styles/theme";
import { Weather } from "./weather/weather";
import { Time } from "./time/time";

interface UpperTimelineProps {
}

export const UpperTimeline: StyledFC<UpperTimelineProps> = (props) => {

	return (
		<div>
			<Weather>
			</Weather>
			<Time>
			</Time>
			<SeparatorBar />
		</div>
	);
}

const SeparatorBar = styled.div`
	height: 3px;
	background-color: ${props => props.theme.color.bgDark};
`