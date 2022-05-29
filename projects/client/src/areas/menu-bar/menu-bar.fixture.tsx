import * as React from 'react';
import { Text } from '@/core/text';
import { CosmosFixture } from '@/test';
import { Flex } from '@messman/react-common';
import { MenuBar } from './menu-bar';

export default CosmosFixture.create(() => {
	return (
		<MenuBar>
			<Flex>
				<Text>Content</Text>
			</Flex>
		</MenuBar>
	);
}, {});