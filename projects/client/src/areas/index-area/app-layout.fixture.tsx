import * as React from 'react';
import { CosmosFixture } from '@/test';
import { fixtureDefault } from '@/test/cosmos-fixture';
import { ApplicationLayout } from './app-layout';

export default CosmosFixture.create(() => {
	return (
		<ApplicationLayout />
	);
}, {
	setup: fixtureDefault.root
});