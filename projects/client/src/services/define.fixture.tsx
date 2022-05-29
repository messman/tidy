import * as React from 'react';
import { ParagraphBodyText } from '@/core/text';
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
			<ParagraphBodyText>Build Time: {DEFINE.buildTime} ({new Date(DEFINE.buildTime).toISOString()})</ParagraphBodyText>
			<ParagraphBodyText>Build Version: {DEFINE.buildVersion}</ParagraphBodyText>
			<ParagraphBodyText>API Root: {DEFINE.apiRoot}</ParagraphBodyText>
			<ParagraphBodyText>Local Test Data Reference Time: {referenceTime}</ParagraphBodyText>
		</>
	);
}, {
	hasMargin: true
});
