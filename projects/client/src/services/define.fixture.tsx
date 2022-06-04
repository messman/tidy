import * as React from 'react';
import { Paragraph } from '@/core/text';
import { CosmosFixture } from '@/test';
import { FixtureContainer } from '@/test/cosmos-fixture';
import { useBatchContent } from './data/data';
import { DEFINE } from './define';

export default CosmosFixture.create(() => {

	const { success } = useBatchContent();
	console.log(DEFINE);


	let referenceTime: string = '...';
	if (success) {
		referenceTime = success.meta.referenceTime.toISO()!;
	}

	return (
		<>
			<Paragraph>Build Time: {DEFINE.buildTime} ({new Date(DEFINE.buildTime).toISOString()})</Paragraph>
			<Paragraph>Build Version: {DEFINE.buildVersion}</Paragraph>
			<Paragraph>API Root: {DEFINE.apiRoot}</Paragraph>
			<Paragraph>Local Test Data Reference Time: {referenceTime}</Paragraph>
		</>
	);
}, {
	container: FixtureContainer.panelPadding
});
