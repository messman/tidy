import * as React from 'react';
import { CosmosFixture } from '@/test';
import { FixtureSetup } from '@/test/cosmos-fixture';
import { Education } from './learn';

export default CosmosFixture.create(() => {
	return (
		<Education />
	);
}, {
	setup: FixtureSetup.root
});