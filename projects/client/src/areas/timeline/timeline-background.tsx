import * as React from 'react';
import { styled } from '@/core/theme/styled';
import { hasAllResponseData, useAllResponse } from '@/services/data/data';
import { pixelsPerDay, timeToPixels } from '@/services/time';
import { TimelineBaseProps } from './bar/timeline-bar-common';

export interface TimelineBackgroundProps extends TimelineBaseProps {
	barWidth: number;
}

export const TimelineBackground: React.FC<TimelineBackgroundProps> = (props) => {

	const allResponseState = useAllResponse();
	if (!hasAllResponseData(allResponseState)) {
		return null;
	}
	const { barWidth, timelineStartTime } = props;
	if (barWidth < 1) {
		return null;
	}
	const { info } = allResponseState.data!;

	/*
		day of the referenceTime should always have the default dark background instead of the other background.
	*/
	const isFirstDayAlternate = !timelineStartTime.hasSame(info.referenceTime, 'day');

	// First, handle the rest of the start day.
	const endOfStartDay = timelineStartTime.endOf('day');
	const remainingPixelsStartDay = timeToPixels(timelineStartTime, endOfStartDay);
	const widths: number[] = [remainingPixelsStartDay];

	let totalBarWidthRemaining = props.barWidth - remainingPixelsStartDay;
	while (totalBarWidthRemaining > 0) {
		const newTotalBarWidthRemaining = Math.max(0, totalBarWidthRemaining - pixelsPerDay);
		widths.push(totalBarWidthRemaining - newTotalBarWidthRemaining);
		totalBarWidthRemaining = newTotalBarWidthRemaining;
	}

	let totalLeft = 0;
	const backgrounds = widths.map((width, i) => {
		const left = totalLeft;
		const key = `bg_${left}_${width}`;
		const isAlternate = i % 2 === (isFirstDayAlternate ? 0 : 1);
		totalLeft += width;
		return (
			<FlippingBackground
				key={key}
				left={left}
				backgroundWidth={width}
				isAlternate={isAlternate}
			/>
		);
	});

	return (
		<>
			{backgrounds}
		</>
	);
};

interface FlippingBackgroundProps {
	left: number,
	backgroundWidth: number,
	isAlternate: boolean;
}

const FlippingBackground = styled.div<FlippingBackgroundProps>`
	position: absolute;
	top: 0;
	left: ${p => p.left}px;
	width: ${p => p.backgroundWidth}px;
	height: 100%;
	background-color: ${p => p.isAlternate ? p.theme.color.backgroundTimelineDay : p.theme.color.background};
`;