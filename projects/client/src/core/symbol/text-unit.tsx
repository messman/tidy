import * as React from 'react';
import { TextInline, SmallTextInline } from './text';
import { styled } from '../style/styled';
import { DateTime } from 'luxon';
import { getTimeTwelveHour } from '@/services/time';

export interface TextUnitProps {
	text: string,
	unit: string,
	space?: number
}

export const TextUnit: React.FC<TextUnitProps> = (props) => {

	const space = (props.space || 1) / 10;

	return (
		<NonBreakingTextInline>
			{props.text}
			<Unit space={space}>{props.unit}</Unit>
		</NonBreakingTextInline>
	);
}

const NonBreakingTextInline = styled(TextInline)`
	white-space: nowrap;
`;

interface UnitProps {
	space: number
}

const Unit = styled(SmallTextInline) <UnitProps>`
	vertical-align: baseline;
	margin-left: ${p => p.space}rem;
`;

export interface TimeTextUnitProps {
	dateTime: DateTime
}

export const TimeTextUnit: React.FC<TimeTextUnitProps> = (props) => {
	const twelveHour = getTimeTwelveHour(props.dateTime);
	return (
		<TextUnit text={twelveHour.time} unit={twelveHour.ampm} space={2} />
	);
}