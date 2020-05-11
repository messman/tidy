import * as React from 'react';
import { DEFINE } from '@/services/define';
import { decorate } from '@/test/storybook/decorate';
import { TextPara } from '@/core/symbol/text';

export default { title: 'Base/Build' };

export const Define = decorate(() => {

	let referenceTime: string = 'not provided';
	if (DEFINE.localTestData) {
		referenceTime = DEFINE.localTestData.info.referenceTime.toISOString();
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