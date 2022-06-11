import { DateTime } from 'luxon';
import * as React from 'react';
import { CosmosFixture } from '@/test';
import { FixtureContainer } from '@/test/cosmos-fixture';
import * as iso from '@wbtdevlocal/iso';
import { Block } from '../theme/box';
import { TideExtremeIcon, TideLevelIcon } from './tide-level-icon';

export default CosmosFixture.create(() => {

	const height = 0;
	const time = DateTime.now();
	const entries: iso.Tide.Stamp[] = [
		{ division: iso.Tide.Division.high, direction: iso.Tide.Direction.turning, height, time },
		{ division: iso.Tide.Division.high, direction: iso.Tide.Direction.falling, height, time },
		{ division: iso.Tide.Division.mid, direction: iso.Tide.Direction.falling, height, time },
		{ division: iso.Tide.Division.low, direction: iso.Tide.Direction.falling, height, time },
		{ division: iso.Tide.Division.low, direction: iso.Tide.Direction.turning, height, time },
		{ division: iso.Tide.Division.low, direction: iso.Tide.Direction.rising, height, time },
		{ division: iso.Tide.Division.mid, direction: iso.Tide.Direction.rising, height, time },
		{ division: iso.Tide.Division.high, direction: iso.Tide.Direction.rising, height, time },
		{ division: iso.Tide.Division.mid, direction: iso.Tide.Direction.turning, height, time },
	];

	const entriesRender = entries.map((entry) => {
		return <TideLevelIcon key={`${entry.division}-${entry.direction}`} tide={entry} />;
	});

	return (
		<>
			{entriesRender}
			<Block.Dog16 />
			<TideExtremeIcon isLow={true} />
			<TideExtremeIcon isLow={false} />
		</>
	);
}, {
	container: FixtureContainer.panelPadding
});