import * as React from 'react';
import { Cosmos, CosmosFixture } from '@/test';
import { FixtureSetup } from '@/test/cosmos-fixture';
import { VisualCss } from './visual-css';

export default CosmosFixture.create(() => {

	const height = Cosmos.useControlValue("Height", 5);

	return (
		<>
			<VisualCss height={height} />
		</>
	);
}, {
	setup: FixtureSetup.glass
});
