import * as React from 'react';
import { CosmosFixture } from '@/test';
import { FixtureContainer } from '@/test/cosmos-fixture';
import { Conditions } from './conditions';

export default CosmosFixture.create(() => {
	return (
		<Conditions />
	);
}, {
	container: FixtureContainer.panel
});