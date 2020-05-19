import * as React from 'react';
import { useAllResponse, hasAllResponseData } from '@/services/data/data';
import { timeToPixels } from '@/services/time';
import { TimelineBarLine, TimelineDotEntry } from './timeline-bar-common';
import { useCurrentTheme } from '@/core/style/theme';
import { DateTime } from 'tidy-shared/node_modules/@types/luxon';
import { styled } from '@/core/style/styled';

// Used instead of the hours value of other components so that we can still show the highlight bar.
const customCutoffMinutesFromReference = 30;
const customCutoffHoursForTitle = 1;

export const TimelineBarAstro: React.FC = () => {

	const allResponseState = useAllResponse();
	const theme = useCurrentTheme();
	const color = theme.color.sun;
	if (!hasAllResponseData(allResponseState)) {
		return null;
	}
	const { all, info } = allResponseState.data!;
	const { sun, cutoffDate } = all.predictions;

	// Filter out event if it's too close to our reference time or after our cutoff.
	const referenceTimePlusCutoff = info.referenceTime.plus({ minutes: customCutoffMinutesFromReference });
	const validSunEvents = sun.filter((sunEvent) => {
		return (sunEvent.time > referenceTimePlusCutoff) && (sunEvent.time < cutoffDate);
	});

	const lastEvent = validSunEvents[validSunEvents.length - 1];
	// Add some time padding to make sure we include all necessary information.
	const lastEventTime = lastEvent.time.plus({ hours: 1 });
	const widthPixels = timeToPixels(info.referenceTime, lastEventTime);

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
		)
	});

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
		const sunsetEvent = validSunEvents[startIndex + 1] || lastEventTime;
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

	return (
		<TimelineBarLine lineWidth={widthPixels}>
			{sunBars}
			{sunEntries}
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
