import * as React from 'react';
import { CosmosFixture } from '@/test';
import { FixtureContainer } from '@/test/cosmos-fixture';
import * as iso from '@wbtdevlocal/iso';
import { TideLevelIcon } from './tide-level-icon';

export default CosmosFixture.create(() => {

	const entries: iso.Tide.CurrentTide[] = [
		{ division: iso.Tide.TideDivision.high, direction: iso.Tide.TideDirection.stable, height: 0 },
		{ division: iso.Tide.TideDivision.high, direction: iso.Tide.TideDirection.falling, height: 0 },
		{ division: iso.Tide.TideDivision.mid, direction: iso.Tide.TideDirection.falling, height: 0 },
		{ division: iso.Tide.TideDivision.low, direction: iso.Tide.TideDirection.falling, height: 0 },
		{ division: iso.Tide.TideDivision.low, direction: iso.Tide.TideDirection.stable, height: 0 },
		{ division: iso.Tide.TideDivision.low, direction: iso.Tide.TideDirection.rising, height: 0 },
		{ division: iso.Tide.TideDivision.mid, direction: iso.Tide.TideDirection.rising, height: 0 },
		{ division: iso.Tide.TideDivision.high, direction: iso.Tide.TideDirection.rising, height: 0 },
		{ division: iso.Tide.TideDivision.mid, direction: iso.Tide.TideDirection.stable, height: 0 },
	];

	const entriesRender = entries.map((entry) => {
		return <TideLevelIcon key={`${entry.division}-${entry.direction}`} level={entry} />;
	});

	return (
		<>
			{entriesRender}
		</>
	);
}, {
	container: FixtureContainer.panelPadding
});