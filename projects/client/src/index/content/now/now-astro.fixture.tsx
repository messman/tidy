import * as React from 'react';
import { SpacePanelGridPadding } from '@/index/core/layout/layout-panel';
import { CosmosFixture } from '@/test';
import { FixtureSetup } from '@/test/cosmos-fixture';
import { NowAstro } from './now-astro';

export default CosmosFixture.create(() => {
	return (
		<SpacePanelGridPadding.PadA>
			<NowAstro />
		</SpacePanelGridPadding.PadA>
	);
}, {
	setup: FixtureSetup.root,
	isSuccessOnly: true
});