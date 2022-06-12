import * as React from 'react';
import { PanelTitle } from '@/core/layout/panel/panel';
import { BeachTimeStatus, getBeachTimeStatus } from '@/services/content/beach-time-utility';
import { useBatchResponse } from '@/services/data/data';
import * as iso from '@wbtdevlocal/iso';

export const BeachTimeTitle: React.FC = () => {
	const { meta, beach } = useBatchResponse().success!;
	return (
		<PanelTitle>{iso.mapEnumValue(BeachTimeStatus, beachTimeStatusTitle, getBeachTimeStatus(beach, meta.referenceTime))}</PanelTitle>
	);
};

const beachTimeStatusTitle: Record<keyof typeof BeachTimeStatus, string> = {
	current: `It's beach time!`,
	currentEndingSoon: `Beach time ends soon.`,
	nextSoon: `Beach time starts soon.`,
	nextLater: `Beach time is back later.`,
	nextTomorrow: `Beach time is back tomorrow.`,
	other: `It's not beach time.`,
};