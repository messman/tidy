import * as React from 'react';
import { CosmosFixture } from '@/test';
import { FixtureContainer } from '@/test/cosmos-fixture';
import { Tide } from './tide';

export default CosmosFixture.create(() => {
	return (
		<Tide />
	);
}, {
	container: FixtureContainer.panel
});