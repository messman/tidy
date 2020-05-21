import { DateTime } from 'luxon';
import * as React from 'react';
import { FlexColumn } from '@/core/layout/flex';
import { styled } from '@/core/style/styled';
import { TimeTextUnit } from '@/core/symbol/text-unit';
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
	backgroundColor: string;
}

const barDotDiameter = 10;

export const TimelineBarDot = styled.div<TimelineBarDotProps>`
	display: block;
	width: ${barDotDiameter}px;
	height: ${barDotDiameter}px;
	margin-top: .3rem;
	border-radius: 50%;
	background-color: ${p => p.backgroundColor};
	flex: none;
`;

interface TimelineEntryContainer {
	left: number,
	top: string;
}

const TimelineEntryContainer = styled(FlexColumn) <TimelineEntryContainer>`
	position: absolute;
	top: ${p => p.top};
	left: ${p => p.left}px;
	width: 0;
	height: 0;
`;

export interface TimelineEntryProps {
	referenceTime: DateTime,
	dateTime: DateTime,
	top: string;
}

export const TimelineEntry: React.FC<TimelineEntryProps> = (props) => {
	const left = timeToPixels(props.referenceTime, props.dateTime);

	return (
		<TimelineEntryContainer alignItems='center' justifyContent='flex-end' left={left} top={props.top}>
			{props.children}
		</TimelineEntryContainer>
	);
};

export interface TimelineDotEntryProps extends Omit<TimelineEntryProps, 'top'> {
	backgroundColor: string,
	isTimeHidden?: boolean;
	isHourOnly?: boolean;
}

export const dotEntryTop = `${(barDotDiameter + barLineThickness) / 2}px`;

export const TimelineDotEntry: React.FC<TimelineDotEntryProps> = (props) => {
	const timeTextUnit = props.isTimeHidden ? null : <TimeTextUnit dateTime={props.dateTime} isHourOnly={props.isHourOnly} />;

	return (
		<TimelineEntry referenceTime={props.referenceTime} dateTime={props.dateTime} top={dotEntryTop}>
			{timeTextUnit}
			<TimelineBarDot backgroundColor={props.backgroundColor} />
		</TimelineEntry>
	);
};