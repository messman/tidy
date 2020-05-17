import * as React from 'react';
import { decorate } from '@/test/storybook/decorate';
import { Text } from '@/core/symbol/text';
import { ContextBlock } from './context-block';
import { Flex } from '@/core/layout/flex';

export default { title: 'areas/summary' };

export const ContextBlocks = decorate(() => {
	return (
		<ContextBlock
			Primary={MockPrimary}
			Secondary={MockSecondary}
		/>
	);
});

const MockPrimary: React.FC = () => {
	return (
		<Flex>
			<Text>Primary</Text>
			<Text>Primary</Text>
			<Text>Primary</Text>
			<Text>Primary</Text>
		</Flex>
	)
};

const MockSecondary: React.FC = () => {
	return (
		<Flex>
			<Text>Secondary</Text>
			<Text>Secondary</Text>
		</Flex>
	)
};