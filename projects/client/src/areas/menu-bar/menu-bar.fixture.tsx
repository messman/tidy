import * as React from 'react';
import { Paragraph } from '@/core/text';
import { CosmosFixture } from '@/test';
import { MenuBar } from './menu-bar';

export default CosmosFixture.create(() => {
	return (
		<MenuBar>
			<Paragraph>Content</Paragraph>
		</MenuBar>
	);
}, {});