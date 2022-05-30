import * as React from 'react';
import { Cosmos, CosmosFixture } from '@/test';
import { IconLabel, LabelText } from './label';
import { SubtleLine } from './layout/line/line';
import { Block } from './theme/box';

export default CosmosFixture.create(() => {

	const leftIcon = Cosmos.useControlSelectIcon('Left Icon');
	const rightIcon = Cosmos.useControlSelectIcon('Right Icon');
	const justifyContent = Cosmos.useControlValue('Stretch', false) ? 'space-between' : 'flex-start';

	return (
		<>
			<Block.Dog16 />
			<LabelText size='medium'>
				Medium Label Text
			</LabelText>
			<Block.Dog16 />
			<LabelText size='small'>
				Small Label Text
			</LabelText>
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
	hasMargin: true
});