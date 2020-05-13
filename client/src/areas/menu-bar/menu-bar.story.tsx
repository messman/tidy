import * as React from 'react';
import { decorateFullScreen } from '@/test/storybook/decorate';
import { Text } from '@/core/symbol/text';
import { MenuBar } from './menu-bar';
import { Flex } from '@/core/layout/flex';

export default { title: 'areas/menu-bar' };

export const MenuBars = decorateFullScreen(() => {
	return (
		<MenuBar>
			<Flex>
				<Text>Content</Text>
			</Flex>
		</MenuBar>
	);
});