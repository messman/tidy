import * as React from 'react';
import { tab } from '@/index/app/nav/nav-context';
import { CosmosFixture } from '@/test';
import { FixtureSetup } from '@/test/cosmos-fixture';
import { Learn } from './learn';

export default CosmosFixture.create(() => {
	return (
		<Learn />
	);
}, {
	setup: FixtureSetup.root,
	tab: tab.learn
});