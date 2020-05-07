import * as React from 'react';
import { DEFINE } from '@/services/define';

export default { title: 'Test' };

export const withText = () => {
	return <p>{DEFINE.buildTime} {DEFINE.buildVersion} {DEFINE.localTestData.info.referenceTime.toISOString()}</p>
};