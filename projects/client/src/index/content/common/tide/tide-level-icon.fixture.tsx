import { DateTime } from 'luxon';
import * as React from 'react';
import { Block } from '@/index/core/layout/layout-shared';
import { CosmosFixture } from '@/test';
import { FixtureSetup } from '@/test/cosmos-fixture';
import { TideLevelDirection, TideLevelDivision, TidePoint } from '@wbtdevlocal/iso';
import { TideExtremeIcon, TideLevelIcon } from './tide-level-icon';

export default CosmosFixture.create(() => {

	const height = 0;
	const time = DateTime.now();
	const computed = 0;
	const isComputed = false;
	const isAlternate = false;
	const entries: TidePoint[] = [
		{ division: TideLevelDivision.high, direction: TideLevelDirection.turning, height, time, computed, isComputed, isAlternate },
		{ division: TideLevelDivision.high, direction: TideLevelDirection.falling, height, time, computed, isComputed, isAlternate },
		{ division: TideLevelDivision.mid, direction: TideLevelDirection.falling, height, time, computed, isComputed, isAlternate },
		{ division: TideLevelDivision.low, direction: TideLevelDirection.falling, height, time, computed, isComputed, isAlternate },
		{ division: TideLevelDivision.low, direction: TideLevelDirection.turning, height, time, computed, isComputed, isAlternate },
		{ division: TideLevelDivision.low, direction: TideLevelDirection.rising, height, time, computed, isComputed, isAlternate },
		{ division: TideLevelDivision.mid, direction: TideLevelDirection.rising, height, time, computed, isComputed, isAlternate },
		{ division: TideLevelDivision.high, direction: TideLevelDirection.rising, height, time, computed, isComputed, isAlternate },
		{ division: TideLevelDivision.mid, direction: TideLevelDirection.turning, height, time, computed, isComputed, isAlternate },
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
	setup: FixtureSetup.root
});