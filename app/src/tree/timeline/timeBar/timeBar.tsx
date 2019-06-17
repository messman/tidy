import * as React from "react";
import { Flex, FlexRow, FlexColumn } from "@/unit/components/flex";
import styled, { css, ThemedCSS, StyledFC } from "@/styles/theme";
import { useAppDataContext } from "@/tree/appData";
import { timeToPixels } from "@/services/time";
import { DayRange } from "./dayRange";
import { SunEvent } from "../../../../../data";
import { EventMarkers } from "./eventMarkers/eventMarkers";

// IMPORTANT ASSUMPTION - there is always a sunrise for a sunset in the returned data.


interface TimeBarProps {
}


export const TimeBar: StyledFC<TimeBarProps> = (props) => {

	const { isLoading, success } = useAppDataContext();

	let days: JSX.Element = null;
	if (!isLoading && success && success.success) {
		const startTime = success.info.time;
		const events = success.success.predictions.sun;

		const dayEvents = groupByDays(events);

		days = (
			<>
				{
					dayEvents.map((eventGroup) => {
						return <DayRange
							key={eventGroup.sunrise.getTime()}
							startTime={startTime}
							sunrise={eventGroup.sunrise}
							sunset={eventGroup.sunset}
						/>
					})
				}
			</>
		);
	}

	return (
		<DayContainer>
			{days}
			<EventMarkers />
		</DayContainer>
	);
}

const DayContainer = styled.div`
	position: relative;
	font-size: 0;

	& > * {
		font-size: initial;
	}
`;

interface SunEventGroup {
	sunrise: Date,
	sunset: Date,
}

function groupByDays(sunEvents: SunEvent[]): SunEventGroup[] {
	const days: { [day: string]: SunEventGroup } = {};
	sunEvents.forEach(function (event) {
		const time = event.time;
		const dayKey = `${time.getMonth()}_${time.getDate()}`;
		if (!days[dayKey]) {
			days[dayKey] = {
				sunrise: null,
				sunset: null
			};
		}
		const day = days[dayKey];
		if (event.isSunrise) {
			day.sunrise = time;
		} else {
			day.sunset = time;
		}
	});
	const groups = Object.values(days);
	return groups.sort(function (a, b) {
		return a.sunrise.getTime() - b.sunrise.getTime();
	});
}