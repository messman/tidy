import * as React from 'react';
import { CosmosFixture } from '@/test';
import { useControlValue } from '@/test/cosmos';
import { fixtureDefault } from '@/test/cosmos-fixture';
import { Bubbles } from './background-bubbles';

export default CosmosFixture.create(() => {

	const isActive = useControlValue("Is Active", false);

	return (
		<>
			<Bubbles isActive={isActive} />
			<p>{isActive ? "Active" : "Not active"}</p>
		</>
	);
}, {
	setup: fixtureDefault.root
});
