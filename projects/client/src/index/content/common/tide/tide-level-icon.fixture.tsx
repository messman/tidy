import * as React from 'react';
import { Block } from '@/index/core/layout/layout-shared';
import { CosmosFixture } from '@/test';
import { FixtureSetup } from '@/test/cosmos-fixture';
import { TideLevelDirection, TideLevelDivision } from '@wbtdevlocal/iso';
import { TideExtremeIcon, TideLevelIcon, TidePointCurrentSimplified } from './tide-level-icon';

export default CosmosFixture.create(() => {

	const entries: TidePointCurrentSimplified[] = [
		{ division: TideLevelDivision.high, direction: TideLevelDirection.turning },
		{ division: TideLevelDivision.high, direction: TideLevelDirection.falling },
		{ division: TideLevelDivision.mid, direction: TideLevelDirection.falling },
		{ division: TideLevelDivision.low, direction: TideLevelDirection.falling },
		{ division: TideLevelDivision.low, direction: TideLevelDirection.turning },
		{ division: TideLevelDivision.low, direction: TideLevelDirection.rising },
		{ division: TideLevelDivision.mid, direction: TideLevelDirection.rising },
		{ division: TideLevelDivision.high, direction: TideLevelDirection.rising },
		{ division: TideLevelDivision.mid, direction: TideLevelDirection.turning },
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
	setup: FixtureSetup.glass
});