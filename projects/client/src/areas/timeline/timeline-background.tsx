import * as React from 'react';
import { styled } from '@/core/style/styled';
import { timeToPixels, pixelsPerDay } from '@/services/time';
import { useAllResponse, hasAllResponseData } from '@/services/data/data';

export interface TimelineBackgroundProps {
	barWidth: number
}

export const TimelineBackground: React.FC<TimelineBackgroundProps> = (props) => {

	const allResponseState = useAllResponse();
	if (!hasAllResponseData(allResponseState)) {
		return null;
	}
	if (props.barWidth < 1) {
		return null;
	}
	const { info } = allResponseState.data!;

	// First, handle the rest of today.
	const endOfReferenceDay = info.referenceTime.endOf('day');
	const remainingPixelsToday = timeToPixels(info.referenceTime, endOfReferenceDay);
	const widths: number[] = [remainingPixelsToday];

	let totalBarWidthRemaining = props.barWidth - remainingPixelsToday;
	while (totalBarWidthRemaining > 0) {
		const newTotalBarWidthRemaining = Math.max(0, totalBarWidthRemaining - pixelsPerDay);
		widths.push(totalBarWidthRemaining - newTotalBarWidthRemaining);
		totalBarWidthRemaining = newTotalBarWidthRemaining;
	}

	let totalLeft = 0;
	const backgrounds = widths.map((width, i) => {
		const left = totalLeft;
		const key = `bg_${left}_${width}`;
		const isAlternate = i % 2 !== 0;
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
	isAlternate: boolean
}

const FlippingBackground = styled.div<FlippingBackgroundProps>`
	position: absolute;
	top: 0;
	left: ${p => p.left}px;
	width: ${p => p.backgroundWidth}px;
	height: 100%;
	background-color: ${p => p.isAlternate ? p.theme.color.backgroundTimelineDay : p.theme.color.background};
`;