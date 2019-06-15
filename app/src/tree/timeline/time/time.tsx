import * as React from "react";
import { Flex, FlexRow, FlexColumn } from "@/unit/components/flex";
import styled, { css, ThemedCSS, StyledFC } from "@/styles/theme";
import * as C from "@/styles/common";
import { APIResponse } from "../../../../../data";
import { useRef } from "react";
import { useElementSize } from "@/unit/hooks/useElementSize";

interface TimeProps {
	isLoading: boolean,
	apiResponse: APIResponse
}

export const Time: StyledFC<TimeProps> = (props) => {

	return (
		<TimeBarContainer>
			Container
		</TimeBarContainer>
	);
}

const TimeBarContainer = styled.div`
	height: 23px;
	line-height: 23px;
`;