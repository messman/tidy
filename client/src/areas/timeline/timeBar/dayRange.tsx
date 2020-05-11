import * as React from 'react';
import { styled, StyledFC } from '@/core/style/styled';
import { pixelsPerDay, isSameDay, timeToPixels } from '@/services/time';
import { FullDay } from './fullDay';

interface DayRangeProps {
	startTime: Date,
	sunrise: Date,
	sunset: Date
}


export const DayRange: StyledFC<DayRangeProps> = (props) => {

	const { startTime, sunrise, sunset } = props;

	let width = pixelsPerDay;
	let timeInDay: Date = null!;
	if (isSameDay(startTime, sunrise)) {
		timeInDay = startTime;
		const nextDay = new Date(startTime.getTime());
		nextDay.setHours(24, 0, 0, 0);
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

	width: ${props => props.total}px;
	overflow: hidden;
`;