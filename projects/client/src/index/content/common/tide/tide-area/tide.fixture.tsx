import * as React from 'react';
import { CosmosFixture } from '@/test';
import { FixtureSetup } from '@/test/cosmos-fixture';
import { Tide } from './tide';

export default CosmosFixture.create(() => {
	return (
		<Tide />
	);
}, {
	setup: FixtureSetup.root
});