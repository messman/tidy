import * as React from 'react';
import { Paragraph } from '@/core/text';
import { CosmosFixture } from '@/test';
import { Block } from '../../theme/box';
import { DistinctLine, SubtleLine } from './line';

export default CosmosFixture.create(() => {

	return (
		<>
			<Paragraph>Here is some text.</Paragraph>
			<Block.Bat08 />
			<SubtleLine />
			<Block.Bat08 />
			<Paragraph>Here is some text.</Paragraph>
			<Block.Bat08 />
			<DistinctLine />
			<Block.Bat08 />
			<Paragraph>Here is some text.</Paragraph>
		</>
	);
}, {
	hasMargin: true
});
