import * as React from 'react';
import { styled, StyledFC } from '@/core/style/styled';
import { useAllResponse, hasAllResponseData } from '@/services/data/data';
import { DayRange } from './dayRange';
import { EventMarkers } from './eventMarkers/eventMarkers';
import { SunEvent } from 'tidy-shared';
import { DateTime } from 'luxon';

// IMPORTANT ASSUMPTION - there is always a sunrise for a sunset in the returned data.


interface TimeBarProps {
}


export const TimeBar: StyledFC<TimeBarProps> = () => {
	const allResponseState = useAllResponse();
	if (!hasAllResponseData(allResponseState)) {
		return null;
	}
	const { all, info } = allResponseState.data!;

	let days: JSX.Element | null = null;
	const startTime = info.referenceTime;
	const events = all.predictions.sun;

	const dayEvents = groupByDays(events);

	days = (
		<>
			{
				dayEvents.map((eventGroup) => {
					return <DayRange
						key={eventGroup.sunrise.valueOf()}
						startTime={startTime}
						sunrise={eventGroup.sunrise}
						sunset={eventGroup.sunset}
					/>
				})
			}
		</>
	);

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
	sunrise: DateTime,
	sunset: DateTime,
}

function groupByDays(sunEvents: SunEvent[]): SunEventGroup[] {
	const days: { [day: string]: SunEventGroup } = {};
	sunEvents.forEach(function (event) {
		const time = event.time;
		const dayKey = `${time.month}_${time.day}`;
		if (!days[dayKey]) {
			days[dayKey] = {
				sunrise: null!,
				sunset: null!
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
		return a.sunrise.valueOf() - b.sunrise.valueOf();
	});
}