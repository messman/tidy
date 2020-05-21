import * as React from 'react';
import { DateTime } from 'tidy-shared/node_modules/@types/luxon';
import { styled } from '@/core/style/styled';
import { useCurrentTheme } from '@/core/style/theme';
import { Text } from '@/core/symbol/text';
import { hasAllResponseData, useAllResponse } from '@/services/data/data';
import { getDateDayOfWeek, timeToPixels } from '@/services/time';
import { dotEntryTop, TimelineBarDot, TimelineBarLine, TimelineDotEntry, TimelineEntry, TimelineEntryProps } from './timeline-bar-common';

// Used instead of the hours value of other components so that we can still show the highlight bar.
const customCutoffMinutesFromReference = 30;
const customCutoffHoursForTitle = 1;

const customDayCutoffHoursFromStart = 1;
const customDayCutoffHoursFromEnd = 1;

export const TimelineBarAstro: React.FC = () => {

	const allResponseState = useAllResponse();
	const theme = useCurrentTheme();
	const color = theme.color.sun;
	if (!hasAllResponseData(allResponseState)) {
		return null;
	}
	const { all, info } = allResponseState.data!;
	const { sun, cutoffDate } = all.predictions;

	//
	// Sun Entries
	//

	// Filter out event if it's too close to our reference time or after our cutoff.
	const referenceTimePlusCutoff = info.referenceTime.plus({ minutes: customCutoffMinutesFromReference });
	const validSunEvents = sun.filter((sunEvent) => {
		return (sunEvent.time > referenceTimePlusCutoff) && (sunEvent.time < cutoffDate);
	});

	const lastEvent = validSunEvents[validSunEvents.length - 1];
	// Add some time padding to make sure we include all necessary information.
	const paddedLastEventTime = lastEvent.time.plus({ hours: 1 });
	const widthPixels = timeToPixels(info.referenceTime, paddedLastEventTime);

	const referenceTimePlusTitleCutoff = info.referenceTime.plus({ hours: customCutoffHoursForTitle });
	const sunEntries = validSunEvents.map((sunEvent) => {

		// If within the cutoff, don't show the time.
		const isTitleHidden = sunEvent.time < referenceTimePlusTitleCutoff;

		return (
			<TimelineDotEntry
				key={sunEvent.time.valueOf()}
				referenceTime={info.referenceTime}
				dateTime={sunEvent.time}
				backgroundColor={color}
				isTimeHidden={isTitleHidden}
			/>
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
		sunEventTimePairs.push([info.referenceTime, firstEvent.time]);
	}
	for (startIndex; startIndex < validSunEvents.length; startIndex += 2) {
		const sunriseEvent = validSunEvents[startIndex];
		// Rely on the fact that we always have a sunrise and a sunset.. but we may have cut the sunset off, so have a backup.
		const sunsetEvent = validSunEvents[startIndex + 1] || paddedLastEventTime;
		if (sunriseEvent && sunsetEvent) {
			sunEventTimePairs.push([sunriseEvent.time, sunsetEvent.time]);
		}
	}

	const sunBars = sunEventTimePairs.map((timePairs) => {
		const key = `pair_${timePairs[0].valueOf()}`;
		const left = timeToPixels(info.referenceTime, timePairs[0]);
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

	const dayStartCutoffDate = info.referenceTime.plus({ hours: customDayCutoffHoursFromStart });
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
		return (
			<TimelineDayDotEntry
				key={key}
				referenceTime={info.referenceTime}
				dateTime={dayEvent}
				backgroundColor={theme.color.textAndIcon}
			/>
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


export interface TimelineDayDotEntryProps extends Omit<TimelineEntryProps, 'top'> {
	backgroundColor: string,
}

export const TimelineDayDotEntry: React.FC<TimelineDayDotEntryProps> = (props) => {
	return (
		<TimelineEntry referenceTime={props.referenceTime} dateTime={props.dateTime} top={dotEntryTop}>
			<NonBreaking>

				<Text>{getDateDayOfWeek(props.dateTime)}</Text>
			</NonBreaking>
			<TimelineBarDot backgroundColor={props.backgroundColor} />
		</TimelineEntry>
	);
};

const NonBreaking = styled.div`
	white-space: nowrap;
`;