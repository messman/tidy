import * as React from 'react';
import { CosmosFixture } from '@/test';
import { fixtureDefault } from '@/test/cosmos-fixture';
import { BeachTime } from './beach-time';

export default CosmosFixture.create(() => {
	return (
		<BeachTime />
	);
}, {
	setup: fixtureDefault.docTwo
});