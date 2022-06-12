import * as React from 'react';
import { PanelPadding } from '@/core/layout/panel/panel';
import { PanelLoader } from '@/core/layout/panel/panel-loader';
import { Note } from '@/core/note';
import { Block } from '@/core/theme/box';
import { useBatchResponse } from '@/services/data/data';
import { BeachTimeBadges } from './beach-time-badges';
import { BeachTimeDays } from './beach-time-days';
import { BeachTimeDescription } from './beach-time-description';
import { BeachTimeRequirements } from './beach-time-requirements';
import { BeachTimeTitle } from './beach-time-title';

export const BeachTime: React.FC = () => {
	const { success } = useBatchResponse();

	if (!success) {
		return <PanelLoader />;
	}

	return (
		<>
			<PanelPadding>
				<BeachTimeTitle />
				<BeachTimeBadges />
				<BeachTimeDescription />
			</PanelPadding>
			<BeachTimeRequirements />
			<Block.Bat08 />
			<BeachTimeDays />
			<Block.Bat08 />
			<PanelPadding>
				<Note>
					"Beach time" is a subjective approximation based on available data for tides, sunlight, and weather (specifically, chance for rain or storms).
					Temperature is not considered. Data is not guaranteed accurate, and is less accurate the further it is based from the current time.
				</Note>
			</PanelPadding>
		</>
	);
};

