import * as React from 'react';
import { useBatchResponse } from '@/index/core/data/data';
import { PanelTitle } from '@/index/core/layout/panel';
import * as iso from '@wbtdevlocal/iso';
import { BeachTimeStatus, beachTimeStatusTextInfoFunc, getBeachTimeStatus } from './beach-time-utility';

export const BeachTimeTitle: React.FC = () => {
	const { meta, beach } = useBatchResponse().success!;

	const beachTimeStatus = getBeachTimeStatus(beach, meta.referenceTime);
	const textInfoFunc = iso.mapNumberEnumValue(BeachTimeStatus, beachTimeStatusTextInfoFunc, beachTimeStatus);
	const { title } = textInfoFunc(beach, meta.referenceTime);

	return (
		<PanelTitle>{title}</PanelTitle>
	);
};

