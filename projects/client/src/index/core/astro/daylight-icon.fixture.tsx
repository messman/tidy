import * as React from 'react';
import { CosmosFixture } from '@/test';
import { fixtureDefault } from '@/test/cosmos-fixture';
import { DaylightIcon } from './daylight-icon';

export default CosmosFixture.create(() => {

	return (
		<>
			<DaylightIcon isDaytime={true} />
			<DaylightIcon isDaytime={false} />
		</>
	);
}, {
	setup: fixtureDefault.docTwoPad
});