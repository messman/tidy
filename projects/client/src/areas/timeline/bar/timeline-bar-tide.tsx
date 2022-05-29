import { DateTime } from 'luxon';
import * as React from 'react';
import { useCurrentTheme } from '@/core/style/theme';
import { SmallText } from '@/core/text';
import { TimeTextUnit } from '@/core/text-unit';
import { styled } from '@/core/theme/styled';
import { TideHeightTextUnit } from '@/core/tide/tide-common';
import { hasAllResponseData, useAllResponse } from '@/services/data/data';
import { timeToPixels } from '@/services/time';
import { renderCutoffHours, textCutoffHours, TimelineBarLine, TimelineBaseProps, TimelineDotEntry, TimelineEntryContainer } from './timeline-bar-common';

export interface TimelineBarTideProps extends TimelineBaseProps { }

export const TimelineBarTide: React.FC<TimelineBarTideProps> = (props) => {

	const allResponseState = useAllResponse();
	const theme = useCurrentTheme();
	const color = theme.color.tide;
	if (!hasAllResponseData(allResponseState)) {
		return null;
	}
	const { timelineStartTime } = props;
	const { all } = allResponseState.data!;
	const { tides, cutoffDate } = all.predictions;

	// After we filter out entries, we also use this value to determine whether we show the text for the dot entry.
	const startTimePlusTextCutoff = timelineStartTime.plus({ hours: textCutoffHours });
	const cutoffTimeMinusTextCutoff = cutoffDate.minus({ hours: textCutoffHours });

	// Filter out status if it's too close to our start time or after our cutoff.
	const startTimePlusRenderCutoff = timelineStartTime.plus({ hours: renderCutoffHours });
	const cutoffTimeMinusRenderCutoff = cutoffDate.minus({ hours: renderCutoffHours });

	const allTideEvents = [...tides.outsidePrevious, ...tides.events];
	const validTideEvents = allTideEvents.filter((tideEvent) => {
		return (tideEvent.time > startTimePlusRenderCutoff) && (tideEvent.time < cutoffTimeMinusRenderCutoff);
	});

	const lastEvent = validTideEvents[validTideEvents.length - 1];
	// Add some time padding to make sure we include all necessary information.
	const lastEventTime = lastEvent.time.plus({ hours: 2 });
	const widthPixels = timeToPixels(timelineStartTime, lastEventTime);

	// TODO - exclude any entries past the cutoff or too close to our reference time
	const tideDotEntries: JSX.Element[] = [];
	const tideDataEntries: JSX.Element[] = [];
	validTideEvents.forEach((tideEvent) => {

		const showText = tideEvent.time > startTimePlusTextCutoff && tideEvent.time < cutoffTimeMinusTextCutoff;
		const textUnitAfterTextCutoff = showText ? <TimeTextUnit dateTime={tideEvent.time} /> : null;

		const timeKey = `time_${tideEvent.time.valueOf()}`;
		tideDotEntries.push(
			<TimelineDotEntry
				key={timeKey}
				startTime={timelineStartTime}
				dateTime={tideEvent.time}
				dotColor={color}
				isSmall={false}
			>
				{textUnitAfterTextCutoff}
			</TimelineDotEntry>
		);

		if (showText) {
			const dataKey = `data_${tideEvent.time.valueOf()}`;
			tideDataEntries.push(
				<TimelineTideDataEntry
					key={dataKey}
					startTime={timelineStartTime}
					dateTime={tideEvent.time}
					isLow={tideEvent.isLow}
					height={tideEvent.height}
				/>
			);
		}
	});

	return (
		<PaddedTimelineBarLine lineWidth={widthPixels}>
			{tideDotEntries}
			{tideDataEntries}
		</PaddedTimelineBarLine>
	);
};

const tideTimelineMarginBottom = '4rem';
const tideTimelineDataEntryOffset = '2rem';

const PaddedTimelineBarLine = styled(TimelineBarLine)`
	margin-bottom: ${tideTimelineMarginBottom};

`;

export interface TimelineTideDataEntryProps {
	startTime: DateTime;
	dateTime: DateTime;
	isLow: boolean,
	height: number,
}

export const TimelineTideDataEntry: React.FC<TimelineTideDataEntryProps> = (props) => {
	const { startTime, dateTime, isLow, height } = props;
	const left = timeToPixels(startTime, dateTime);

	/*
		Structure:
		- Outer FlexColumn that centers children horizontally
			- The last child is the dot that sits at the very bottom and should align with the 'top'/'left' provided
	*/
	return (
		<TimelineEntryContainer alignItems='center' left={left} top={tideTimelineDataEntryOffset}>
			<SmallText>{isLow ? 'LOW' : 'HIGH'}</SmallText>
			<TideHeightTextUnit height={height} />
		</TimelineEntryContainer>
	);
};