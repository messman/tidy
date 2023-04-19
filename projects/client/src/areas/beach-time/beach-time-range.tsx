import { DateTime } from 'luxon';
import * as React from 'react';
import styled from 'styled-components';
import { fontStyleDeclarations } from '@/core/text';
import { getTimeTwelveHourRange, getTimeTwelveHourString } from '@/services/time';
import * as iso from '@wbtdevlocal/iso';
import { BeachTimeRangeVisual } from './beach-time-range-visual';

export interface BeachTimeRangeViewProps {
	referenceTime: DateTime;
	day: iso.Batch.BeachTimeDay;
}

export const BeachTimeRangeView: React.FC<BeachTimeRangeViewProps> = (props) => {
	const { referenceTime, day } = props;
	const { ranges, day: dateTime } = day;

	const rangesRender = ranges.map((range) => {
		const rangeRender = range.start.equals(referenceTime) ? (
			<>Now &ndash; {getTimeTwelveHourString(range.stop)}</>
		) : getTimeTwelveHourRange(range.start, range.stop);

		return <SubtleBodyText key={range.start.toMillis()}>{rangeRender}</SubtleBodyText>;
	});

	let noneText: JSX.Element | null = null;
	if (!ranges.length) {
		/*
			Because tides and sun are consistent, there's only two reasons
			we don't have a beach time for a day: weather, or because it's today
			and the day is already gone by.
		*/
		if (dateTime.hasSame(referenceTime, 'day')) {
			// Leave it ambiguous for now
			noneText = (
				<SubtleBodyText>
					No suggested times
				</SubtleBodyText>
			);
		}
		else {
			noneText = (
				<SubtleBodyText>
					Bad weather &ndash; no suggested times
				</SubtleBodyText>
			);
		}
	}

	return (
		<>
			<BeachTimeRangeVisual referenceTime={referenceTime} day={day} />
			{rangesRender}
			{noneText}
		</>
	);
};

const SubtleBodyText = styled.div`
	${fontStyleDeclarations.body};
	color: ${p => p.theme.textSubtle};
	text-align: right;
`;