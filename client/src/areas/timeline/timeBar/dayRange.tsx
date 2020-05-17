import * as React from 'react';
import { styled, StyledFC } from '@/core/style/styled';
import { pixelsPerDay, timeToPixels } from '@/services/time';
import { FullDay } from './fullDay';
import { DateTime } from 'luxon';

interface DayRangeProps {
	startTime: DateTime,
	sunrise: DateTime,
	sunset: DateTime
}


export const DayRange: StyledFC<DayRangeProps> = (props) => {

	const { startTime, sunrise, sunset } = props;

	let width = pixelsPerDay;
	let timeInDay: DateTime = null!;
	if (startTime.hasSame(sunrise, 'day')) {
		timeInDay = startTime;
		const nextDay = startTime.endOf('day');
		width = timeToPixels(startTime, nextDay);
	}

	return (
		<DayRangeContainer total={width}>
			<FullDay
				timeInDay={timeInDay}
				sunrise={sunrise}
				sunset={sunset}
			/>
		</DayRangeContainer>
	);
}

interface DayRangeContainerProps {
	total: number,

}

const DayRangeContainer = styled.div<DayRangeContainerProps>`
	position: relative;
	display: inline-block;
	height: 26px;
	line-height: 26px;

	width: ${p => p.total}px;
	overflow: hidden;
`;