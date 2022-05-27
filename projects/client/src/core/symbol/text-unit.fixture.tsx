import { DateTime } from 'luxon';
import * as React from 'react';
import { Icon, iconTypes } from '@/core/symbol/icon';
import { CosmosFixture } from '@/test';
import { flowPaddingValue } from '../style/common';
import { styled } from '../style/styled';
import { Text, textHeight } from './text';
import { TextUnit, TimeDurationTextUnit, TimeTextUnit } from './text-unit';

const localDateTime = DateTime.local();

export default CosmosFixture.create(() => {
	const minutesOnlyFromLocal = localDateTime.plus({ minutes: 28 });
	const hoursOnlyFromLocal = localDateTime.plus({ hours: 7 });
	const fromLocal = localDateTime.plus({ hours: 2, minutes: 28 });

	return (
		<>
			<Padding>
				<TextUnit text='9:45' unit='AM' />
			</Padding>
			<Padding>
				<TimeTextUnit dateTime={localDateTime} />
			</Padding>
			<Padding>
				<Text>
					You can expect <TimeDurationTextUnit startTime={localDateTime} endTime={minutesOnlyFromLocal} /> of sunlight.
				</Text>
				<Text>
					You can expect <TimeDurationTextUnit startTime={localDateTime} endTime={hoursOnlyFromLocal} /> of sunlight.
				</Text>
				<Text>
					You can expect <TimeDurationTextUnit startTime={localDateTime} endTime={fromLocal} /> of sunlight.
				</Text>
			</Padding>
			<Padding>
				<Text>
					<Icon type={iconTypes.wind} height={textHeight} /> <TextUnit text='22' unit='mph ESE' />
				</Text>
			</Padding>
			<Padding>
				<Text>
					<TextUnit text='8' unit='ft' />, <TextUnit text='24' unit='m' />, <TextUnit text='8:00' unit='PM' />
				</Text>
			</Padding>
		</>
	);
}, {
	hasMargin: true
});

const Padding = styled.div`
	margin: ${flowPaddingValue};
`;