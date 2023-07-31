import * as React from 'react';
import { CosmosFixture } from '@/test';
import { FixtureSetup } from '@/test/cosmos-fixture';
import { BeachTime } from './beach-time';

export default CosmosFixture.create(() => {
	return (
		<BeachTime />
	);
}, {
	setup: FixtureSetup.root
});