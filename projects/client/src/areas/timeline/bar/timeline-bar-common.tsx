import { DateTime } from 'luxon';
import * as React from 'react';
import { FlexColumn } from '@/core/layout/flex';
import { styled } from '@/core/style/styled';
import { timeToPixels } from '@/services/time';

// Weather won't start until after the reference time.
export const weatherCutoffHoursFromReference = .75;
// If less than this amount of time to the edge of the screen, don't even render the event.
export const renderCutoffHours = 0.25;
// If less than this amount of time to the edge of the screen, don't show the text component of the event.
export const textCutoffHours = 1;

export interface TimelineBaseProps {
	/** Used to calculate left offset for absolutely-positioned elements. */
	timelineStartTime: DateTime;
}

interface TimelineBarLineProps {
	lineWidth: number;
}

const barLineThickness = 6;

export const TimelineBarLine = styled.div<TimelineBarLineProps>`
	position: relative;
	/* Used to make all bar lines the same width */
	min-width: ${p => p.lineWidth}px;
	height: ${barLineThickness}px;
	background-color: ${p => p.theme.color.backgroundLightest};
`;

interface TimelineBarDotProps {
	dotColor: string;
	isSmall: boolean;
}

const barDotDiameter = 12;
const barSmallDotDiameter = 6;

export const TimelineBarDot = styled.div<TimelineBarDotProps>`
	display: block;
	width: ${p => p.isSmall ? barSmallDotDiameter : barDotDiameter}px;
	height: ${p => p.isSmall ? barSmallDotDiameter : barDotDiameter}px;
	margin-top: .3rem;
	border-radius: 50%;
	background-color: ${p => p.dotColor};
	flex: none;
`;

export interface TimelineDotEntryProps {
	startTime: DateTime;
	dateTime: DateTime;
	dotColor: string;
	isSmall: boolean;
}

const dotEntryTop = `${(barDotDiameter + barLineThickness) / 2}px`;
const smallDotEntryTop = `${(barSmallDotDiameter + barLineThickness) / 2}px`;

export const TimelineDotEntry: React.FC<TimelineDotEntryProps> = (props) => {
	const { startTime, dateTime, dotColor, isSmall, children } = props;
	const left = timeToPixels(startTime, dateTime);

	/*
		Structure:
		- Outer FlexColumn that centers children horizontally and all child elements will appear *above* it
			- The last child is the dot that sits at the very bottom and should align with the 'top'/'left' provided
	*/
	const entryTop = isSmall ? smallDotEntryTop : dotEntryTop;
	return (
		<TimelineEntryContainer alignItems='center' justifyContent='flex-end' left={left} top={entryTop}>
			{children}
			<TimelineBarDot dotColor={dotColor} isSmall={isSmall} />
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