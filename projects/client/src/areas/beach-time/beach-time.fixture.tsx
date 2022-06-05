import * as React from 'react';
import { CosmosFixture } from '@/test';
import { FixtureContainer } from '@/test/cosmos-fixture';
import { BeachTime } from './beach-time';

export default CosmosFixture.create(() => {
	return (
		<BeachTime />
	);
}, {
	container: FixtureContainer.panel
});