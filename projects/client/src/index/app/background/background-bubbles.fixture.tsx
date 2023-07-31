import * as React from 'react';
import { CosmosFixture } from '@/test';
import { useControlValue } from '@/test/cosmos';
import { Bubbles } from './background-bubbles';

export default CosmosFixture.create(() => {

	const isActive = useControlValue("Is Active", false);

	return (
		<>
			<Bubbles isActive={isActive} />
			<p>{isActive ? "Active" : "Not active"}</p>
		</>
	);
}, {});
