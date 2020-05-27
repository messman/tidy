import { DateTime } from 'luxon';
import * as React from 'react';
import { getTimeTwelveHour } from '@/services/time';
import { styled } from '../style/styled';
import { SmallTextInline, TextInline } from './text';

export interface TextUnitProps {
	text: string,
	unit: string,
	space?: number;
}

export const TextUnit: React.FC<TextUnitProps> = (props) => {

	const space = (props.space || 1) / 10;

	return (
		<NonBreakingTextInline>
			{props.text}
			<Unit space={space}>{props.unit}</Unit>
		</NonBreakingTextInline>
	);
};

const NonBreakingTextInline = styled(TextInline)`
	white-space: nowrap;
`;

interface UnitProps {
	space: number;
}

const Unit = styled(SmallTextInline) <UnitProps>`
	vertical-align: baseline;
	margin-left: ${p => p.space}rem;
`;

export interface TimeTextUnitProps {
	dateTime: DateTime;
	isHourOnly?: boolean;
}

export const TimeTextUnit: React.FC<TimeTextUnitProps> = (props) => {
	const twelveHour = getTimeTwelveHour(props.dateTime);
	return (
		<TextUnit text={props.isHourOnly ? twelveHour.hour : twelveHour.time} unit={twelveHour.ampm} space={2} />
	);
};

export interface TimeDurationTextUnitProps {
	startTime: DateTime;
	endTime: DateTime;
}

export const TimeDurationTextUnit: React.FC<TimeDurationTextUnitProps> = (props) => {
	// Probably one of the coolest things Luxon does:
	const duration = props.endTime.diff(props.startTime, ['hours', 'minutes']);

	const hours = duration.hours > 0 ? (<TextUnit text={duration.hours.toString()} unit='h' />) : null;

	const roundedMinutes = Math.round(duration.minutes);
	const minutes = roundedMinutes > 0 ? (<TextUnit text={roundedMinutes.toString()} unit='m' />) : null;
	const space = (!!hours && !!minutes) ? (<>&nbsp;</>) : null;

	return (
		<>
			{hours}{space}{minutes}
		</>
	);
};