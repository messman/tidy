import { DateTime } from 'luxon';
import * as React from 'react';
import { SizedIcon } from '@/core/icon/icon';
import { CosmosFixture } from '@/test';
import { FixtureContainer } from '@/test/cosmos-fixture';
import { icons } from '@wbtdevlocal/assets';
import { Paragraph } from './text';
import { TextUnit, TimeDurationTextUnit, TimeTextUnit } from './text-unit';
import { Block } from './theme/box';

const localDateTime = DateTime.local();

export default CosmosFixture.create(() => {
	const minutesOnlyFromLocal = localDateTime.plus({ minutes: 28 });
	const hoursOnlyFromLocal = localDateTime.plus({ hours: 7 });
	const fromLocal = localDateTime.plus({ hours: 2, minutes: 28 });

	return (
		<>
			<TextUnit text='9:45' unit='AM' />
			<Block.Dog16 />
			<TimeTextUnit dateTime={localDateTime} />
			<Block.Dog16 />
			<Paragraph>
				You can expect <TimeDurationTextUnit startTime={localDateTime} endTime={minutesOnlyFromLocal} /> of sunlight.
			</Paragraph>
			<Paragraph>
				You can expect <TimeDurationTextUnit startTime={localDateTime} endTime={hoursOnlyFromLocal} /> of sunlight.
			</Paragraph>
			<Paragraph>
				You can expect <TimeDurationTextUnit startTime={localDateTime} endTime={fromLocal} /> of sunlight.
			</Paragraph>
			<Block.Dog16 />
			<Paragraph>
				<SizedIcon type={icons.weatherWind} size='medium' /> <TextUnit text='22' unit='mph ESE' />
			</Paragraph>
			<Block.Dog16 />
			<Paragraph>
				<TextUnit text='8' unit='ft' />, <TextUnit text='24' unit='m' />, <TextUnit text='8:00' unit='PM' />
			</Paragraph>
			<Block.Dog16 />
		</>
	);
}, {
	container: FixtureContainer.panelPadding
});