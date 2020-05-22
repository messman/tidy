import * as React from 'react';
import { styled } from '@/core/style/styled';
import { useCurrentTheme } from '@/core/style/theme';
import { SmallText } from '@/core/symbol/text';
import { TideHeightTextUnit } from '@/core/tide/tide-common';
import { hasAllResponseData, useAllResponse } from '@/services/data/data';
import { timeToPixels } from '@/services/time';
import { cutoffHoursFromReference, TimelineBarLine, TimelineDotEntry, TimelineEntry, TimelineEntryProps } from './timeline-bar-common';

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
				backgroundColor={color}
			/>
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

const PaddedTimelineBarLine = styled(TimelineBarLine)`
	margin-bottom: 4rem;

`;

export interface TimelineTideDataEntryProps extends Omit<TimelineEntryProps, 'top'> {
	isLow: boolean,
	height: number,
}

export const TimelineTideDataEntry: React.FC<TimelineTideDataEntryProps> = (props) => {
	const tideHighLowText = props.isLow ? 'LOW' : 'HIGH';

	return (
		<TimelineEntry referenceTime={props.referenceTime} dateTime={props.dateTime} top='4rem'>
			<SmallText>{tideHighLowText}</SmallText>
			<TideHeightTextUnit height={props.height} />
		</TimelineEntry>
	);
};