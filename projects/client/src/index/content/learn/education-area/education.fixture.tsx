import * as React from 'react';
import { CosmosFixture } from '@/test';
import { fixtureDefault } from '@/test/cosmos-fixture';
import { Education } from './education';

export default CosmosFixture.create(() => {
	return (
		<Education />
	);
}, {
	setup: fixtureDefault.docTwo
});