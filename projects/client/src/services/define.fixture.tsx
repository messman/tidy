import * as React from 'react';
import { TextPara } from '@/core/symbol/text';
import { DEFINE, useDefine } from '@/services/define';
import { CosmosFixture } from '@/test';
import { useAllResponse } from './data/data';

export default CosmosFixture.create(() => {

	const allResponseState = useAllResponse();
	const define = useDefine();
	console.log(define);


	let referenceTime: string = '...';
	if (allResponseState.data) {
		referenceTime = allResponseState.data.info.referenceTime.toISO()!;
	}

	return (
		<>
			<TextPara>Build Time: {DEFINE.buildTime} ({new Date(DEFINE.buildTime).toISOString()})</TextPara>
			<TextPara>Build Version: {DEFINE.buildVersion}</TextPara>
			<TextPara>API Root: {DEFINE.apiRoot}</TextPara>
			<TextPara>Local Test Data Reference Time: {referenceTime}</TextPara>
		</>
	);
}, {
	hasMargin: true
});
