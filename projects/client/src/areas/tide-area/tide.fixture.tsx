import * as React from 'react';
import { CosmosFixture } from '@/test';
import { fixtureDefault } from '@/test/cosmos-fixture';
import { Tide } from './tide';

export default CosmosFixture.create(() => {
	return (
		<Tide />
	);
}, {
	setup: fixtureDefault.docTwo
});