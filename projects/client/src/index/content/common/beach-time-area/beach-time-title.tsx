import * as React from 'react';
import { useBatchResponse } from '@/index/core/data/data';
import { PanelTitle } from '@/index/core/layout/panel';
import { mapNumberEnumValue } from '@wbtdevlocal/iso';
import { BeachTimeContextualStatus, beachTimeStatusTextInfoFunc, getBeachTimeStatus } from './beach-time-utility';

export const BeachTimeTitle: React.FC = () => {
	const { meta, beach } = useBatchResponse().success!;

	const beachTimeStatus = getBeachTimeStatus(beach, meta.referenceTime);
	const textInfoFunc = mapNumberEnumValue(BeachTimeContextualStatus, beachTimeStatusTextInfoFunc, beachTimeStatus);
	const { title } = textInfoFunc(beach, meta.referenceTime);

	return (
		<PanelTitle>{title}</PanelTitle>
	);
};

