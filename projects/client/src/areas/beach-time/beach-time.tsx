import * as React from 'react';
import { PanelPadding } from '@/core/layout/panel/panel';
import { BeachTimeBadges } from './beach-time-badges';
import { BeachTimeDescription } from './beach-time-description';
import { BeachTimeRequirements } from './beach-time-requirements';
import { BeachTimeTitle } from './beach-time-title';

export const BeachTime: React.FC = () => {

	return (
		<>
			<PanelPadding>
				<BeachTimeTitle />
				<BeachTimeBadges />
				<BeachTimeDescription />
			</PanelPadding>
			<BeachTimeRequirements />
		</>
	);
};