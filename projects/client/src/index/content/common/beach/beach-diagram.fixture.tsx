import * as React from 'react';
import { Cosmos, CosmosFixture } from '@/test';
import { FixtureSetup } from '@/test/cosmos-fixture';
import { BeachDiagram } from './beach-diagram';

export default CosmosFixture.create(() => {

	const height = Cosmos.useControlValue("Height", 5);
	const isGood = Cosmos.useControlValue("Is Good", false);

	return (
		<>
			<BeachDiagram height={height} isGood={isGood} />
		</>
	);
}, {
	setup: FixtureSetup.glass
});
