import * as React from 'react';
import { styled, StyledFC } from '@/core/style/styled';
import { useAppDataContext } from '@/services/data/appData';
import { DayRange } from './dayRange';
import { EventMarkers } from './eventMarkers/eventMarkers';
import { SunEvent } from 'tidy-shared';

// IMPORTANT ASSUMPTION - there is always a sunrise for a sunset in the returned data.


interface TimeBarProps {
}


export const TimeBar: StyledFC<TimeBarProps> = () => {

	const { isLoading, success } = useAppDataContext();

	let days: JSX.Element | null = null;
	if (!isLoading && success && success.data) {
		const startTime = success.info.referenceTime;
		const events = success.data!.predictions.sun;

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
		return a.sunrise.getTime() - b.sunrise.getTime();
	});
}