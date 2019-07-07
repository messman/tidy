import * as React from "react";
import { Flex, FlexRow, FlexColumn } from "@/unit/components/flex";
import styled, { css, ThemedCSS, StyledFC } from "@/styles/theme";
import { Weather } from "./weather/weather";
import { TimeBar } from "./timeBar/timeBar";
import { WeatherEvent } from "../../../../data";

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

/*
 * Some UI elements for weather are spread out. This is their common ancestor. 
 * Check here for wether flags that might go past the cutoff date when rendered in this app. 
 */
const cutoffHoursBefore = 3; // 3 hours before cutoff date (3 hours itself is okay)
export function filterWeatherEvents(events: WeatherEvent[], cutoffDate: Date): WeatherEvent[] {
	const cutoff = new Date(cutoffDate);
	cutoff.setHours(cutoff.getHours() - cutoffHoursBefore);
	return events.filter(function (event) {
		return event.time <= cutoff;
	});
}