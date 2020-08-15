import * as React from 'react';
import { Text } from '@/core/symbol/text';
import { decorate } from '@/test/storybook/decorate';
import { Flex } from '@messman/react-common';
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