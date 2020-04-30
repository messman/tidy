import * as React from "react";
import styled, { StyledFC } from "@/styles/theme";
import { useAppDataContext } from "@/tree/appData";
import { WeatherFlag } from "./weatherFlag";
import { filterWeatherEvents } from "../upperTimeline";

interface WeatherProps {
}

export const Weather: StyledFC<WeatherProps> = () => {
	const { isLoading, success } = useAppDataContext();

	let weatherEvents: JSX.Element | null = null;
	if (!isLoading && success && success.data) {
		const startTime = success.info.referenceTime;
		const events = filterWeatherEvents(success.data!.predictions.weather, success.data!.predictions.cutoffDate);

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
	height: calc(15vh + 15px);
	/* to provide space for the flag content */
	min-height: 135px;
`;