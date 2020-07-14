import * as React from 'react';
import { DateTime } from 'tidy-shared/node_modules/@types/luxon';
import { styled } from '@/core/style/styled';
import { useCurrentTheme } from '@/core/style/theme';
import { Text } from '@/core/symbol/text';
import { TimeTextUnit } from '@/core/symbol/text-unit';
import { hasAllResponseData, useAllResponse } from '@/services/data/data';
import { getDateDayOfWeek, pixelsToTime, timeToPixels } from '@/services/time';
import { renderCutoffHours, textCutoffHours, TimelineBarLine, TimelineBaseProps, TimelineDotEntry } from './timeline-bar-common';

// When listing day entries, don't show so close to the end of our timeline.
const customDayCutoffHoursFromEnd = 1;

export interface TimelineBarAstroProps extends TimelineBaseProps {
	barWidth: number;
}

export const TimelineBarAstro: React.FC<TimelineBarAstroProps> = (props) => {

	const allResponseState = useAllResponse();
	const theme = useCurrentTheme();
	const color = theme.color.sun;
	if (!hasAllResponseData(allResponseState)) {
		return null;
	}
	const { timelineStartTime, barWidth } = props;
	const { all } = allResponseState.data!;
	const { sun, cutoffDate } = all.predictions;

	// After we filter out entries, we also use this value to determine whether we show the text for the dot entry.
	const startTimePlusTextCutoff = timelineStartTime.plus({ hours: textCutoffHours });
	const cutoffTimeMinusTextCutoff = cutoffDate.minus({ hours: textCutoffHours });

	//
	// Sun Entries
	//

	// Filter out event if it's too close to our reference time or after our cutoff.
	const startTimePlusRenderCutoff = timelineStartTime.plus({ hours: renderCutoffHours });
	const cutoffTimeMinusRenderCutoff = cutoffDate.minus({ hours: renderCutoffHours });
	const validSunEvents = sun.filter((sunEvent) => {
		return (sunEvent.time > startTimePlusRenderCutoff) && (sunEvent.time < cutoffTimeMinusRenderCutoff);
	});

	const lastEvent = validSunEvents[validSunEvents.length - 1];
	// Add some time padding to make sure we include all necessary information.
	const paddedLastEventTime = lastEvent.time.plus({ hours: 1 });
	const widthPixels = timeToPixels(timelineStartTime, paddedLastEventTime);

	const sunEntries = validSunEvents.map((sunEvent) => {
		const showText = sunEvent.time > startTimePlusTextCutoff && sunEvent.time < cutoffTimeMinusTextCutoff;
		const textUnitAfterTextCutoff = showText ? <TimeTextUnit dateTime={sunEvent.time} /> : null;

		return (
			<TimelineDotEntry
				key={sunEvent.time.valueOf()}
				startTime={timelineStartTime}
				dateTime={sunEvent.time}
				dotColor={color}
				isSmall={false}
			>
				{textUnitAfterTextCutoff}
			</TimelineDotEntry>
		);
	});

	//
	// Bars between sun entries
	//

	const sunEventTimePairs: DateTime[][] = [];
	const firstEvent = validSunEvents[0];
	let startIndex = 0;
	if (!firstEvent.isSunrise) {
		startIndex = 1;
		sunEventTimePairs.push([timelineStartTime, firstEvent.time]);
	}
	for (startIndex; startIndex < validSunEvents.length; startIndex += 2) {
		const sunriseEvent = validSunEvents[startIndex];

		// Rely on the fact that we always have a sunrise and a sunset.. but we may have cut the sunset off, so have a backup.
		// The backup is why we have the total bar width - use it to send a bar off the edge of our render area.
		let sunsetEvent = validSunEvents[startIndex + 1];
		if (!sunsetEvent) {
			sunsetEvent = { isSunrise: false, time: pixelsToTime(timelineStartTime, barWidth).plus({ hours: .5 }) };
		}
		if (sunriseEvent && sunsetEvent) {
			sunEventTimePairs.push([sunriseEvent.time, sunsetEvent.time]);
		}
	}

	const sunBars = sunEventTimePairs.map((timePairs) => {
		const key = `pair_${timePairs[0].valueOf()}`;
		const left = timeToPixels(timelineStartTime, timePairs[0]);
		const width = timeToPixels(timePairs[0], timePairs[1]);

		return (
			<SunBar
				key={key}
				left={left}
				lineWidth={width}
			/>
		);
	});

	//
	// Day Entries
	//

	const dayStartCutoffDate = timelineStartTime.plus({ hours: renderCutoffHours });
	const dayEndCutoffDate = cutoffDate.minus({ hours: customDayCutoffHoursFromEnd });
	// Start with the beginning of the next day, after our cutoff.
	let day = dayStartCutoffDate.plus({ days: 1 });
	const dayEvents: DateTime[] = [];
	// Don't worry about adding an entry for the end of the day of the last event - that next day won't be a full day.
	while (day < dayEndCutoffDate) {
		dayEvents.push(day.startOf('day'));

		// Set up for next day
		day = day.plus({ days: 1 });
	}

	const dayEntries = dayEvents.map((dayEvent) => {
		const key = `astro_day_${dayEvent.valueOf()}`;
		let textAfterCutoff: JSX.Element | null = null;
		if (dayEvent > startTimePlusTextCutoff) {
			textAfterCutoff = (
				<NonBreaking>
					<Text>{getDateDayOfWeek(dayEvent)}</Text>
				</NonBreaking>
			);
		}

		return (
			<TimelineDotEntry
				key={key}
				startTime={timelineStartTime}
				dateTime={dayEvent}
				dotColor={theme.color.disabled}
				isSmall={false}
			>
				{textAfterCutoff}
			</TimelineDotEntry>
		);
	});

	return (
		<TimelineBarLine lineWidth={widthPixels}>
			{sunBars}
			{sunEntries}
			{dayEntries}
		</TimelineBarLine>
	);
};

interface SunBarProps {
	left: number;
}

const SunBar = styled(TimelineBarLine) <SunBarProps>`
	position: absolute;
	left: ${p => p.left}px;
	background-color: ${p => p.theme.color.sun};
`;

const NonBreaking = styled.div`
	white-space: nowrap;
`;