import * as React from 'react';
import { CosmosFixture } from '@/test';
import { FixtureSetup } from '@/test/cosmos-fixture';
import { NowWeather } from './now-weather';

export default CosmosFixture.create(() => {
	return (
		<NowWeather />
	);
}, {
	setup: FixtureSetup.root,
	isSuccessOnly: true
});