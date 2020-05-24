import { DateTime } from 'luxon';
import * as React from 'react';
import { FlexColumn } from '@/core/layout/flex';
import { styled } from '@/core/style/styled';
import { timeToPixels } from '@/services/time';

export const cutoffHoursFromReference = 1.2;

interface TimelineBarLineProps {
	lineWidth: number;
}

const barLineThickness = 4;

export const TimelineBarLine = styled.div<TimelineBarLineProps>`
	position: relative;
	/* Used to make all bar lines the same width */
	min-width: ${p => p.lineWidth}px;
	height: ${barLineThickness}px;
	background-color: ${p => p.theme.color.backgroundLightest};
`;

interface TimelineBarDotProps {
	dotColor: string;
}

const barDotDiameter = 10;

export const TimelineBarDot = styled.div<TimelineBarDotProps>`
	display: block;
	width: ${barDotDiameter}px;
	height: ${barDotDiameter}px;
	margin-top: .3rem;
	border-radius: 50%;
	background-color: ${p => p.dotColor};
	flex: none;
`;

export interface TimelineDotEntryProps {
	referenceTime: DateTime;
	dateTime: DateTime;
	dotColor: string;
}

const dotEntryTop = `${(barDotDiameter + barLineThickness) / 2}px`;

export const TimelineDotEntry: React.FC<TimelineDotEntryProps> = (props) => {
	const { referenceTime, dateTime, dotColor, children } = props;
	const left = timeToPixels(referenceTime, dateTime);

	/*
		Structure:
		- Outer FlexColumn that centers children horizontally and all child elements will appear *above* it
			- The last child is the dot that sits at the very bottom and should align with the 'top'/'left' provided
	*/
	return (
		<TimelineEntryContainer alignItems='center' justifyContent='flex-end' left={left} top={dotEntryTop}>
			{children}
			<TimelineBarDot dotColor={dotColor} />
		</TimelineEntryContainer>
	);
};

export interface TimelineEntryContainer {
	left: number,
	top: string;
}

export const TimelineEntryContainer = styled(FlexColumn) <TimelineEntryContainer>`
	position: absolute;
	top: ${p => p.top};
	left: ${p => p.left}px;
	width: 0;
	height: 0;
`;