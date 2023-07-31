import * as React from 'react';
import { CosmosFixture } from '@/test';
import { FixtureSetup } from '@/test/cosmos-fixture';
import { AppLayout } from './layout-app';

export default CosmosFixture.create(() => {

	return (
		<AppLayout />
	);
}, {
	setup: FixtureSetup.root
});
