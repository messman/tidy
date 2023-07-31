import * as React from 'react';
import { CosmosFixture } from '@/test';
import { FixtureSetup } from '@/test/cosmos-fixture';
import { About } from './about';

export default CosmosFixture.create(() => {
	return (
		<About />
	);
}, {
	setup: FixtureSetup.root
});