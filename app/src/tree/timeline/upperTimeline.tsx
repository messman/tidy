import * as React from "react";
import { Flex, FlexRow, FlexColumn } from "@/unit/components/flex";
import styled, { css, ThemedCSS, StyledFC } from "@/styles/theme";
import * as C from "@/styles/common";
import { APIResponse } from "../../../../data";
import { useRef } from "react";
import { useElementSize } from "@/unit/hooks/useElementSize";
import { Weather } from "./weather/weather";
import { Time } from "./time/time";

interface UpperTimelineProps {
	isLoading: boolean,
	apiResponse: APIResponse
}

export const UpperTimeline: StyledFC<UpperTimelineProps> = (props) => {
	const { isLoading, apiResponse } = props;

	return (
		<div>
			<Weather
				isLoading={isLoading}
				apiResponse={apiResponse}
			>

			</Weather>
			<Time
				isLoading={isLoading}
				apiResponse={apiResponse}
			>
			</Time>
			<SeparatorBar />
		</div>
	);
}

const SeparatorBar = styled.div`
	height: 3px;
	background-color: ${props => props.theme.color.bgDark};
`