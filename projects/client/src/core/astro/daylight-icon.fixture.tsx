import * as React from 'react';
import { CosmosFixture } from '@/test';
import { FixtureContainer } from '@/test/cosmos-fixture';
import { DaylightIcon } from './daylight-icon';

export default CosmosFixture.create(() => {

	return (
		<>
			<DaylightIcon isDaytime={true} />
			<DaylightIcon isDaytime={false} />
		</>
	);
}, {
	container: FixtureContainer.panelPadding
});