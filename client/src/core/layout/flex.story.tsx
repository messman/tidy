import * as React from 'react';
import { decorateFullScreen } from '@/test/storybook/decorate';
import { Text } from '@/core/symbol/text';
import { RootColumn, RootRow, Flex } from './flex';
import { styled } from '../style/styled';

export default { title: 'core/layout' };

const FlexBorder = styled(Flex)`
	border: 2px solid ${p => p.theme.color.textAndIcon};
`;

// 'Root' components use 100% width/height with flex

export const FlexColumn = decorateFullScreen(() => {
	return (
		<RootColumn>
			<FlexBorder flex={2}>
				<Text>Flex Column - 2</Text>
			</FlexBorder>
			<FlexBorder>
				<Text>Flex Column - 1</Text>
			</FlexBorder>
			<FlexBorder flex={0}>
				<Text>Flex Column - 0</Text>
			</FlexBorder>
		</RootColumn>
	);
});

export const FlexRow = decorateFullScreen(() => {
	return (
		<RootRow>
			<FlexBorder flex={2}>
				<Text>Flex Row - 2</Text>
			</FlexBorder>
			<FlexBorder>
				<Text>Flex Row - 1</Text>
			</FlexBorder>
			<FlexBorder flex={0}>
				<Text>Flex Row - 0</Text>
			</FlexBorder>
		</RootRow>
	);
});
