import * as React from 'react';
import { CosmosFixture } from '@/test';
import { useControlValue } from '@/test/cosmos';
import { FixtureSetup } from '@/test/cosmos-fixture';
import { BackgroundLight } from './background-light';

export default CosmosFixture.create(() => {

	const isActive = useControlValue("Is Active", true);

	return (
		<>
			<BackgroundLight isActive={isActive} />
			<p>{isActive ? "Active" : "Not active"}</p>
		</>
	);
}, {
	setup: FixtureSetup.root
});
