import { DateTime } from 'luxon';
import * as React from 'react';
import { SizedIcon } from '@/index/core/icon/icon';
import { CosmosFixture } from '@/test';
import { FixtureSetup } from '@/test/cosmos-fixture';
import { icons } from '@wbtdevlocal/assets';
import { Block } from '../layout/layout-shared';
import { MediumBodyText } from './text-shared';
import { TextUnit, TimeDurationTextUnit, TimeTextUnit } from './text-unit';

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
			<MediumBodyText>
				You can expect <TimeDurationTextUnit startTime={localDateTime} stopTime={minutesOnlyFromLocal} isPrecise={true} /> of sunlight.
			</MediumBodyText>
			<MediumBodyText>
				You can expect <TimeDurationTextUnit startTime={localDateTime} stopTime={hoursOnlyFromLocal} isPrecise={true} /> of sunlight.
			</MediumBodyText>
			<MediumBodyText>
				You can expect <TimeDurationTextUnit startTime={localDateTime} stopTime={fromLocal} isPrecise={true} /> of sunlight.
			</MediumBodyText>
			<Block.Dog16 />
			<MediumBodyText>
				<SizedIcon type={icons.weatherWind} size='medium' /> <TextUnit text='22' unit='mph ESE' />
			</MediumBodyText>
			<Block.Dog16 />
			<MediumBodyText>
				<TextUnit text='8' unit='ft' />, <TextUnit text='24' unit='m' />, <TextUnit text='8:00' unit='PM' />
			</MediumBodyText>
			<Block.Dog16 />
		</>
	);
}, {
	setup: FixtureSetup.glass
});