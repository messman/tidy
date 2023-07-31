import * as React from 'react';
import { PanelTitle } from '@/index/core/layout/panel/panel';
import { BeachTimeStatus, beachTimeStatusTextInfoFunc, getBeachTimeStatus } from '@/services/content/beach-time-utility';
import { useBatchResponse } from '@/services/data/data';
import * as iso from '@wbtdevlocal/iso';

export const BeachTimeTitle: React.FC = () => {
	const { meta, beach } = useBatchResponse().success!;

	const beachTimeStatus = getBeachTimeStatus(beach, meta.referenceTime);
	const textInfoFunc = iso.mapNumberEnumValue(BeachTimeStatus, beachTimeStatusTextInfoFunc, beachTimeStatus);
	const { title } = textInfoFunc(beach, meta.referenceTime);

	return (
		<PanelTitle>{title}</PanelTitle>
	);
};

