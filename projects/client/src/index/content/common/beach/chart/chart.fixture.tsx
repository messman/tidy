import * as React from 'react';
import { useBatchResponseSuccess } from '@/index/core/data/data';
import { MediumBodyText } from '@/index/core/text/text-shared';
import { CosmosFixture } from '@/test';
import { FixtureSetup } from '@/test/cosmos-fixture';
import { BeachChart } from './chart';

export default CosmosFixture.create(() => {

	const { week } = useBatchResponseSuccess();

	return (
		<div>
			<MediumBodyText>(Day 0)</MediumBodyText>
			<BeachChart day={week.days[0]} />
			<MediumBodyText>(Day 1)</MediumBodyText>
			<BeachChart day={week.days[1]} />
		</div>
	);
}, {
	setup: FixtureSetup.glass,
	isSuccessOnly: true
});