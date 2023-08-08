import * as React from 'react';
import { CosmosFixture } from '@/test';
import { FixtureSetup } from '@/test/cosmos-fixture';
import { Toggle } from './toggle';

export default CosmosFixture.create(() => {

	const [isGPS, setIsGPS] = React.useState(false);

	return (
		<>
			<Toggle isDisabled={false} value={isGPS} onToggle={() => { setIsGPS(p => !p); }} />
		</>
	);
}, {
	setup: FixtureSetup.glass
});
