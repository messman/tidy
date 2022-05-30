import * as React from 'react';
import { Paragraph } from '@/core/text';
import { DEFINE, useDefine } from '@/services/define';
import { CosmosFixture } from '@/test';
import { useBatchLatestResponse } from './data/data';

export default CosmosFixture.create(() => {

	const { success } = useBatchLatestResponse();
	const define = useDefine();
	console.log(define);


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
	hasMargin: true
});
