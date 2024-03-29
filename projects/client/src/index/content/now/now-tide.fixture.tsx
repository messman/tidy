import * as React from 'react';
import { SpacePanelGridPadding } from '@/index/core/layout/layout-panel';
import { CosmosFixture } from '@/test';
import { FixtureSetup } from '@/test/cosmos-fixture';
import { NowTide } from './now-tide';

export default CosmosFixture.create(() => {
	return (
		<SpacePanelGridPadding.PadA>
			<NowTide />
		</SpacePanelGridPadding.PadA>
	);
}, {
	setup: FixtureSetup.root,
	isSuccessOnly: true
});