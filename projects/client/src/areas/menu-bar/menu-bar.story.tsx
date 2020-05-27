import * as React from 'react';
import { Flex } from '@/core/layout/flex';
import { Text } from '@/core/symbol/text';
import { decorate } from '@/test/storybook/decorate';
import { MenuBar } from './menu-bar';

export default { title: 'areas/menu-bar' };

export const TestMenuBar = decorate(() => {
	return (
		<MenuBar>
			<Flex>
				<Text>Content</Text>
			</Flex>
		</MenuBar>
	);
});