import * as React from 'react';
import { decorateFullScreen } from '@/test/storybook/decorate';
import { Text } from '@/core/symbol/text';
import { MenuBar } from './menu-bar';
import { Flex, RootRow } from '@/core/layout/flex';
import { ComponentLayoutProvider } from '../layout/responsive-layout';

export default { title: 'areas/menu-bar' };

export const MenuBars = decorateFullScreen(() => {


	// Root can be row or column.
	// Child within must be a flex item.
	return (
		<ComponentLayoutProvider>
			<RootRow>
				<MenuBar>
					<Flex>
						<Text>Content</Text>
					</Flex>
				</MenuBar>
			</RootRow>
		</ComponentLayoutProvider>
	);
});