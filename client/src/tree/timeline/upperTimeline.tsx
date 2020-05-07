import * as React from "react";
import styled, { StyledFC } from "@/styles/styled";
import { Weather } from "./weather/weather";
import { TimeBar } from "./timeBar/timeBar";
import { WeatherStatus } from "tidy-shared";

interface UpperTimelineProps {
}

export const UpperTimeline: StyledFC<UpperTimelineProps> = () => {

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
	background-color: ${props => props.theme.color.background};
`

/*
 * Some UI elements for weather are spread out. This is their common ancestor. 
 * Check here for wether flags that might go past the cutoff date when rendered in this app. 
 */
const cutoffHoursBefore = 3; // 3 hours before cutoff date (3 hours itself is okay)
export function filterWeatherEvents(events: WeatherStatus[], cutoffDate: Date): WeatherStatus[] {
	const cutoff = new Date(cutoffDate);
	cutoff.setHours(cutoff.getHours() - cutoffHoursBefore);
	return events.filter(function (event) {
		return event.time <= cutoff;
	});
}