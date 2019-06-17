import * as React from "react";
import { Flex, FlexRow, FlexColumn } from "@/unit/components/flex";
import styled, { css, ThemedCSS, StyledFC } from "@/styles/theme";
import { Weather } from "./weather/weather";
import { TimeBar } from "./timeBar/timeBar";

interface UpperTimelineProps {
}

export const UpperTimeline: StyledFC<UpperTimelineProps> = (props) => {

	return (
		<div>
			<Weather />
			<TimeBar />
			<SeparatorBar />
		</div>
	);
}

const SeparatorBar = styled.div`
	height: 4px;
	background-color: ${props => props.theme.color.bgDark};
`