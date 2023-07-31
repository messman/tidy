import * as React from 'react';
import { CosmosFixture } from '@/test';
import { FixtureSetup } from '@/test/cosmos-fixture';
import { ApplicationLayout } from './app-layout';

export default CosmosFixture.create(() => {
	return (
		<ApplicationLayout />
	);
}, {
	setup: FixtureSetup.root
});