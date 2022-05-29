import { ParagraphBodyText } from '@/core/text';
import { CosmosFixture } from '@/test';
import * as React from 'react';
import { Block, Margin } from '../../theme/box';
import { DistinctLine, SubtleLine } from './line';

export default CosmosFixture.create(() => {

	return (
		<Margin.Dog16>
			<ParagraphBodyText>Here is some text.</ParagraphBodyText>
			<Block.Bat08 />
			<SubtleLine />
			<Block.Bat08 />
			<ParagraphBodyText>Here is some text.</ParagraphBodyText>
			<Block.Bat08 />
			<DistinctLine />
			<Block.Bat08 />
			<ParagraphBodyText>Here is some text.</ParagraphBodyText>
		</Margin.Dog16>
	);
}, {

});
