import * as React from "react";
import { Flex, FlexRow, FlexColumn } from "@/unit/components/flex";
import styled, { css, ThemedCSS, StyledFC } from "@/styles/theme";
import * as C from "@/styles/common";
import { useAppDataContext } from "@/tree/appData";
import { WeatherFlag } from "./weatherFlag";
import { start } from "repl";

interface WeatherProps {
}

export const Weather: StyledFC<WeatherProps> = (props) => {
	const { isLoading, success } = useAppDataContext();

	let weatherEvents: JSX.Element = null;
	if (!isLoading && success && success.success) {
		const startTime = success.info.time;
		const events = success.success.predictions.weather;

		weatherEvents = (
			<>
				{
					events.map((event) => {
						return <WeatherFlag key={event.time.getTime()} startTime={startTime} event={event} />
					})
				}
			</>
		);
	}

	return (
		<WeatherContainer>
			{weatherEvents}
		</WeatherContainer>
	);
}

const WeatherContainer = styled.div`
	position: relative;
	height: calc(20vh + 35px);
`;