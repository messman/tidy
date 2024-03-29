import { DateTime } from 'luxon';
import * as React from 'react';
import styled from 'styled-components';
import { getDurationDescription, getTimeTwelveHour } from '../time/time';

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

const NonBreakingTextInline = styled.span`
	white-space: nowrap;
	display: inline;
`;

interface UnitProps {
	space: number;
}

const Unit = styled.span<UnitProps>`
	display: inline-block;
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
	stopTime: DateTime;
	/** If true, uses exact hours and minutes instead of a description that gets less precise the longer the time. */
	isPrecise: boolean;
}

export const TimeDurationTextUnit: React.FC<TimeDurationTextUnitProps> = (props) => {
	const { startTime, stopTime, isPrecise } = props;

	if (isPrecise) {
		// Probably one of the coolest things Luxon does:
		const duration = stopTime.diff(startTime, ['hours', 'minutes']);

		const hours = duration.hours > 0 ? (<TextUnit text={duration.hours.toString()} unit='h' />) : null;

		const roundedMinutes = Math.round(duration.minutes);
		const minutes = roundedMinutes > 0 ? (<TextUnit text={roundedMinutes.toString()} unit='m' />) : null;
		const space = (!!hours && !!minutes) ? (<>&nbsp;</>) : null;

		return (
			<>
				{hours}{space}{minutes}
			</>
		);
	}

	return <>{getDurationDescription(startTime, stopTime)}</>;
};