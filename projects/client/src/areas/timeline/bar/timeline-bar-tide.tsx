import * as React from 'react';
import { useAllResponse, hasAllResponseData } from '@/services/data/data';
import { timeToPixels } from '@/services/time';
import { TimelineBarLine, TimelineEntry, cutoffHoursFromReference, TimelineEntryProps, TimelineDotEntry } from './timeline-bar-common';
import { useCurrentTheme } from '@/core/style/theme';
import { SmallText } from '@/core/symbol/text';
import { TextUnit } from '@/core/symbol/text-unit';

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
	const tideEntries = validTideEvents.map((tideEvent) => {
		const timeKey = `time_${tideEvent.time.valueOf()}`;
		const dataKey = `data_${tideEvent.time.valueOf()}`;

		return (
			<>
				<TimelineDotEntry
					key={timeKey}
					referenceTime={info.referenceTime}
					dateTime={tideEvent.time}
					backgroundColor={color}
				/>
				<TimelineTideDataEntry
					key={dataKey}
					referenceTime={info.referenceTime}
					dateTime={tideEvent.time}
					isLow={tideEvent.isLow}
					heightString={tideEvent.height.toFixed(info.tideHeightPrecision)}
				/>
			</>
		)
	});

	return (
		<TimelineBarLine lineWidth={widthPixels}>
			{tideEntries}
		</TimelineBarLine>
	);
};

export interface TimelineTideDataEntryProps extends Omit<TimelineEntryProps, 'top'> {
	isLow: boolean,
	heightString: string,
}

export const TimelineTideDataEntry: React.FC<TimelineTideDataEntryProps> = (props) => {
	const tideHighLowText = props.isLow ? 'LOW' : 'HIGH';

	return (
		<TimelineEntry referenceTime={props.referenceTime} dateTime={props.dateTime} top='4rem'>
			<SmallText>{tideHighLowText}</SmallText>
			<TextUnit text={props.heightString} unit='ft' space={2} />
		</TimelineEntry>
	);
}
