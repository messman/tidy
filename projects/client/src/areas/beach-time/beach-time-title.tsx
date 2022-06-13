import * as React from 'react';
import { PanelTitle } from '@/core/layout/panel/panel';
import { BeachTimeStatus, beachTimeStatusTitle, getBeachTimeStatus } from '@/services/content/beach-time-utility';
import { useBatchResponse } from '@/services/data/data';
import * as iso from '@wbtdevlocal/iso';

export const BeachTimeTitle: React.FC = () => {
	const { meta, beach } = useBatchResponse().success!;
	return (
		<PanelTitle>{iso.mapEnumValue(BeachTimeStatus, beachTimeStatusTitle, getBeachTimeStatus(beach, meta.referenceTime))}</PanelTitle>
	);
};

