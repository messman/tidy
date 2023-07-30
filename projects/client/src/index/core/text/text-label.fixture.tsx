import * as React from 'react';
import { Cosmos, CosmosFixture } from '@/test';
import { fixtureDefault } from '@/test/cosmos-fixture';
import { Block, SubtleLine } from '../layout';
import { IconLabel, MediumLabelText, SmallLabelText } from './text-label';

export default CosmosFixture.create(() => {

	const leftIcon = Cosmos.useControlSelectIcon('Left Icon');
	const rightIcon = Cosmos.useControlSelectIcon('Right Icon');
	const justifyContent = Cosmos.useControlValue('Stretch', false) ? 'space-between' : 'flex-start';

	return (
		<>
			<Block.Dog16 />
			<MediumLabelText>
				Medium Label Text
			</MediumLabelText>
			<Block.Dog16 />
			<SmallLabelText>
				Small Label Text
			</SmallLabelText>
			<Block.Dog16 />
			<SubtleLine />
			<Block.Dog16 />
			<IconLabel size='medium' leftIcon={leftIcon} rightIcon={rightIcon} justifyContent={justifyContent}>
				Medium Label Text
			</IconLabel>
			<Block.Dog16 />
			<IconLabel size='small' leftIcon={leftIcon} rightIcon={rightIcon} justifyContent={justifyContent}>
				Small Label Text
			</IconLabel>
		</>
	);
}, {
	setup: fixtureDefault.docPad
});