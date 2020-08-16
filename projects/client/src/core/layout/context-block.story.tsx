import * as React from 'react';
import { Text } from '@/core/symbol/text';
import { decorate } from '@/test/storybook/decorate';
import { boolean } from '@storybook/addon-knobs';
import { styled } from '../style/styled';
import { ContextBlock } from './context-block';

export default { title: 'core/layout' };

export const TestContextBlock = decorate(() => {

	const isDualMode = boolean('Is Dual Mode', false);

	return (
		<div>
			<ContextBlock
				primary={<MockPrimary />}
				secondary={<MockSecondary />}
				isDualMode={isDualMode}
			/>
		</div>
	);
});

const MockPrimary: React.FC = () => {
	return (
		<Margin>
			<Text>Primary</Text>
			<Text>Primary</Text>
			<Text>Primary</Text>
			<Text>Primary</Text>
		</Margin>
	);
};

const MockSecondary: React.FC = () => {
	return (
		<Margin>
			<Text>Secondary</Text>
			<Text>Secondary</Text>
		</Margin>
	);
};

const Margin = styled.div`
	margin: .5rem;
`;