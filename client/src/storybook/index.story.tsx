import * as React from 'react';
import { DEFINE } from '@/services/define';
import { decorate } from './decorate';
import * as C from '@/styles/common';

export default { title: 'Test' };

export const withText = decorate(() => {
	return <C.Title>{DEFINE.buildTime} {DEFINE.buildVersion} {DEFINE.localTestData.info.referenceTime.toISOString()}</C.Title>
});