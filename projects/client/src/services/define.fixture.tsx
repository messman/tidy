import * as React from 'react';
import { MediumBodyText } from '@/core/text';
import { CosmosFixture } from '@/test';
import { fixtureDefault } from '@/test/cosmos-fixture';
import { useBatchResponse } from './data/data';
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
	setup: fixtureDefault.docTwoPad
});
