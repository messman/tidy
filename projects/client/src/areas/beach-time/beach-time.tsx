import * as React from 'react';
import { SizedIcon } from '@/core/icon/icon';
import { SpinnerIcon } from '@/core/icon/icon-spinner';
import { PanelPadding } from '@/core/layout/panel/panel';
import { useBatchResponse } from '@/services/data/data';
import { BeachTimeBadges } from './beach-time-badges';
import { BeachTimeDays } from './beach-time-days';
import { BeachTimeDescription } from './beach-time-description';
import { BeachTimeRequirements } from './beach-time-requirements';
import { BeachTimeTitle } from './beach-time-title';

export const BeachTime: React.FC = () => {
	const { success } = useBatchResponse();

	if (!success) {
		return <SizedIcon size='medium' type={SpinnerIcon} />;
	}

	return (
		<>
			<PanelPadding>
				<BeachTimeTitle />
				<BeachTimeBadges />
				<BeachTimeDescription />
			</PanelPadding>
			<BeachTimeRequirements />
			<BeachTimeDays />
		</>
	);
};