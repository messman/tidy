import * as React from 'react';
import { MediumBodyText } from '@/index/core/text/text-shared';
import { CosmosFixture } from '@/test';
import { FixtureSetup } from '@/test/cosmos-fixture';
import { useBatchResponse } from './core/data/data';
import { DEFINE } from './define';

export default CosmosFixture.create(() => {

	const { success } = useBatchResponse();
	console.log(DEFINE);


	let referenceTime: string = '...';
	if (success) {
		referenceTime = success.meta.referenceTime.toISO()!;
	}

	return (
		<>
			<MediumBodyText>Build Time: {DEFINE.buildTime} ({new Date(DEFINE.buildTime).toISOString()})</MediumBodyText>
			<MediumBodyText>Build Version: {DEFINE.buildVersion}</MediumBodyText>
			<MediumBodyText>API Root: {DEFINE.apiRoot}</MediumBodyText>
			<MediumBodyText>Local Test Data Reference Time: {referenceTime}</MediumBodyText>
		</>
	);
}, {
	setup: FixtureSetup.root
});
