import * as React from 'react';
import { SpacePanelGridPadding } from '@/index/core/layout/layout-panel';
import { CosmosFixture } from '@/test';
import { FixtureSetup } from '@/test/cosmos-fixture';
import { NowWeather } from './now-weather';

export default CosmosFixture.create(() => {
	return (
		<SpacePanelGridPadding.PadA>
			<NowWeather />
		</SpacePanelGridPadding.PadA>
	);
}, {
	setup: FixtureSetup.root,
	isSuccessOnly: true
});