import * as React from 'react';
import { CosmosFixture } from '@/test';
import { FixtureSetup } from '@/test/cosmos-fixture';
import { NowBeach } from './now-beach';

export default {
	'Default': CosmosFixture.create(() => {
		return (
			<NowBeach />
		);
	}, {
		setup: FixtureSetup.root
	}),
};