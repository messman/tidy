import * as React from 'react';
import { CosmosFixture } from '@/test';
import { FixtureSetup } from '@/test/cosmos-fixture';
import { Conditions } from './conditions';

export default CosmosFixture.create(() => {
	return (
		<Conditions />
	);
}, {
	setup: FixtureSetup.root
});