import * as React from 'react';
import { CosmosFixture } from '@/test';
import { fixtureDefault } from '@/test/cosmos-fixture';
import { Conditions } from './conditions';

export default CosmosFixture.create(() => {
	return (
		<Conditions />
	);
}, {
	setup: fixtureDefault.docTwo
});