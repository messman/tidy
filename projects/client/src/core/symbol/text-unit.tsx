import * as React from 'react';
import { TextInline, SmallTextInline } from './text';
import { styled } from '../style/styled';
import { DateTime } from 'luxon';
import { getTimeTwelveHour } from '@/services/time';

export interface TextUnitProps {
	text: string,
	unit: string
}

export const TextUnit: React.FC<TextUnitProps> = (props) => {
	return (
		<TextInline>
			{props.text}
			<Unit>{props.unit}</Unit>
		</TextInline>
	);
}

const Unit = styled(SmallTextInline)`
	vertical-align: baseline;
	margin-left: .1rem;
`;

export interface TimeTextUnitProps {
	dateTime: DateTime
}

export const TimeTextUnit: React.FC<TimeTextUnitProps> = (props) => {
	const twelveHour = getTimeTwelveHour(props.dateTime);
	return (
		<TextUnit text={twelveHour.time} unit={twelveHour.ampm} />
	);
}