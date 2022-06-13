import * as React from 'react';
import { CosmosFixture } from '@/test';
import { FixtureContainer } from '@/test/cosmos-fixture';
import { Education } from './education';

export default CosmosFixture.create(() => {
	return (
		<Education />
	);
}, {
	container: FixtureContainer.panel
});