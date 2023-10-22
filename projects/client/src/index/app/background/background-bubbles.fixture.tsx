import * as React from 'react';
import { CosmosFixture } from '@/test';
import { useControlValue } from '@/test/cosmos';
import { BackgroundBubbles } from './background-bubbles';

export default CosmosFixture.create(() => {

	const isActive = useControlValue("Is Active", false);

	return (
		<>
			<BackgroundBubbles isActive={isActive} />
			<p>{isActive ? "Active" : "Not active"}</p>
		</>
	);
}, {});
