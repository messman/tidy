import * as React from 'react';
import { Flex } from '@/core/layout/flex';
import { Text } from '@/core/symbol/text';
import { decorate } from '@/test/storybook/decorate';
import { boolean } from '@storybook/addon-knobs';
import { ContextBlock } from './context-block';

export default { title: 'core/layout' };

export const TestContextBlock = decorate(() => {

	const isDualMode = boolean('Is Dual Mode', false);

	return (
		<ContextBlock
			primary={<MockPrimary />}
			secondary={<MockSecondary />}
			isPadded={true}
			isDualMode={isDualMode}
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
	);
};

const MockSecondary: React.FC = () => {
	return (
		<Flex>
			<Text>Secondary</Text>
			<Text>Secondary</Text>
		</Flex>
	);
};