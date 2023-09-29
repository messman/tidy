import * as React from 'react';
import { SpacePanelGridPadding } from '@/index/core/layout/layout-panel';
import { CosmosFixture } from '@/test';
import { FixtureSetup } from '@/test/cosmos-fixture';
import { NowBeach } from './now-beach';

export default CosmosFixture.create(() => {
	return (
		<SpacePanelGridPadding.PadA>

			<NowBeach />
		</SpacePanelGridPadding.PadA>
	);
}, {
	setup: FixtureSetup.root,
	isSuccessOnly: true
});