import * as React from 'react';
import { CosmosFixture } from '@/test';
import { FixtureSetup } from '@/test/cosmos-fixture';
import { NowTide } from './now-tide';

export default CosmosFixture.create(() => {
	return (
		<NowTide />
	);
}, {
	setup: FixtureSetup.root,
	isSuccessOnly: true
});