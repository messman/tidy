import { DateTime } from 'luxon';
import * as React from 'react';
import { styled } from '@/core/style/styled';
import { useCurrentTheme } from '@/core/style/theme';
import { SmallText } from '@/core/symbol/text';
import { TimeTextUnit } from '@/core/symbol/text-unit';
import { TideHeightTextUnit } from '@/core/tide/tide-common';
import { hasAllResponseData, useAllResponse } from '@/services/data/data';
import { timeToPixels } from '@/services/time';
import { cutoffHoursFromReference, TimelineBarLine, TimelineDotEntry, TimelineEntryContainer } from './timeline-bar-common';

export const TimelineBarTide: React.FC = () => {

	const allResponseState = useAllResponse();
	const theme = useCurrentTheme();
	const color = theme.color.tide;
	if (!hasAllResponseData(allResponseState)) {
		return null;
	}
	const { all, info } = allResponseState.data!;
	const { tides, cutoffDate } = all.predictions;

	// Filter out status if it's too close to our reference time or after our cutoff.
	const referenceTimePlusCutoff = info.referenceTime.plus({ hours: cutoffHoursFromReference });
	const validTideEvents = tides.events.filter((tideEvent) => {
		return (tideEvent.time > referenceTimePlusCutoff) && (tideEvent.time < cutoffDate);
	});

	const lastEvent = validTideEvents[validTideEvents.length - 1];
	// Add some time padding to make sure we include all necessary information.
	const lastEventTime = lastEvent.time.plus({ hours: 2 });
	const widthPixels = timeToPixels(info.referenceTime, lastEventTime);

	// TODO - exclude any entries past the cutoff or too close to our reference time
	const tideDotEntries: JSX.Element[] = [];
	const tideDataEntries: JSX.Element[] = [];
	validTideEvents.forEach((tideEvent) => {
		const timeKey = `time_${tideEvent.time.valueOf()}`;
		tideDotEntries.push(
			<TimelineDotEntry
				key={timeKey}
				referenceTime={info.referenceTime}
				dateTime={tideEvent.time}
				dotColor={color}
			>
				<TimeTextUnit dateTime={tideEvent.time} />
			</TimelineDotEntry>
		);


		const dataKey = `data_${tideEvent.time.valueOf()}`;
		tideDataEntries.push(
			<TimelineTideDataEntry
				key={dataKey}
				referenceTime={info.referenceTime}
				dateTime={tideEvent.time}
				isLow={tideEvent.isLow}
				height={tideEvent.height}
			/>
		);
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
	referenceTime: DateTime;
	dateTime: DateTime;
	isLow: boolean,
	height: number,
}

export const TimelineTideDataEntry: React.FC<TimelineTideDataEntryProps> = (props) => {
	const { referenceTime, dateTime, isLow, height } = props;
	const left = timeToPixels(referenceTime, dateTime);

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