import * as React from 'react';
import { CosmosFixture } from '@/test';
import { fixtureDefault } from '@/test/cosmos-fixture';
import { AppLayout } from './layout-app';

export default CosmosFixture.create(() => {

	return (
		<AppLayout />
	);
}, {
	setup: fixtureDefault.root
});
