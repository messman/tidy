import * as React from 'react';
import { decorate } from '@/test/storybook/decorate';
import { iconTypes, Icon } from '@/core/symbol/icon';
import { flowPaddingValue } from '../style/common';
import { TextUnit, TimeTextUnit } from './text-unit';
import { Text, textHeight } from './text';
import { styled } from '../style/styled';
import { DateTime } from 'luxon';

export default { title: 'core/symbol' };

const dateTime = DateTime.local();

export const TextUnits = decorate(() => {
	return (
		<>
			<Padding>
				<TextUnit text='9:45' unit='AM' />
			</Padding>
			<Padding>
				<TimeTextUnit dateTime={dateTime} />
			</Padding>
			<Padding>
				<Text>
					<Icon type={iconTypes.wind} height={textHeight} /> <TextUnit text='22' unit='mph ESE' />
				</Text>
			</Padding>
			<Padding>
				<Text>
					You can expect <TextUnit text='12' unit='h' /> <TextUnit text='14' unit='m' /> of sunlight.
				</Text>
			</Padding>
			<Padding>
				<Text>
					<TextUnit text='8' unit='ft' />, <TextUnit text='24' unit='m' />, <TextUnit text='8:00' unit='PM' />
				</Text>
			</Padding>
		</>
	);
});

const Padding = styled.div`
	margin: ${flowPaddingValue};
`;