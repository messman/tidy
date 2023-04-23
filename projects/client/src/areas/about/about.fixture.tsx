import * as React from 'react';
import { CosmosFixture } from '@/test';
import { fixtureDefault } from '@/test/cosmos-fixture';
import { About } from './about';

export default CosmosFixture.create(() => {
	return (
		<About />
	);
}, {
	setup: fixtureDefault.docTwo
});