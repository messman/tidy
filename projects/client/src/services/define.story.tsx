import * as React from 'react';
import { DEFINE } from '@/services/define';
import { decorate } from '@/test/storybook/decorate';
import { TextPara } from '@/core/symbol/text';
import { useAllResponse } from './data/data';

export default { title: 'services' };

export const TestDefine = decorate(() => {

	const allResponseState = useAllResponse();

	let referenceTime: string = '...';
	if (allResponseState.data) {
		referenceTime = allResponseState.data.info.referenceTime.toISO();
	}

	return (
		<>
			<TextPara>Build Time: {DEFINE.buildTime} ({new Date(DEFINE.buildTime).toISOString()})</TextPara>
			<TextPara>Build Version: {DEFINE.buildVersion}</TextPara>
			<TextPara>Fetch URL: {DEFINE.fetchUrl}</TextPara>
			<TextPara>Local Test Data Reference Time: {referenceTime}</TextPara>
		</>
	);
});