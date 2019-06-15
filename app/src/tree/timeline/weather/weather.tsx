import * as React from "react";
import { Flex, FlexRow, FlexColumn } from "@/unit/components/flex";
import styled, { css, ThemedCSS, StyledFC } from "@/styles/theme";
import * as C from "@/styles/common";

interface WeatherProps {
}

export const Weather: StyledFC<WeatherProps> = (props) => {


	return (
		<WeatherContainer>

		</WeatherContainer>
	);
}

const WeatherContainer = styled.div`
	height: calc(20vh + 35px);
	border: 1px solid orange;
`;