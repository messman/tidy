import * as React from 'react';
import { CosmosFixture } from '@/test';
import { FixtureContainer } from '@/test/cosmos-fixture';
import { About } from './about';

export default CosmosFixture.create(() => {
	return (
		<About />
	);
}, {
	container: FixtureContainer.panel
});