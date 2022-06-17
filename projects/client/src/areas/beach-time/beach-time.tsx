import * as React from 'react';
import { PanelPadding } from '@/core/layout/panel/panel';
import { wrapForBatchLoad } from '@/core/loader/batch-load-control';
import { DefaultErrorLoad } from '@/core/loader/loader';
import { Note } from '@/core/note';
import { Block } from '@/core/theme/box';
import { TideHeightTextUnit } from '@/core/tide/tide-common';
import * as iso from '@wbtdevlocal/iso';
import { BeachTimeBadges } from './beach-time-badges';
import { BeachTimeDays } from './beach-time-days';
import { BeachTimeDescription } from './beach-time-description';
import { BeachTimeRequirements } from './beach-time-requirements';
import { BeachTimeTitle } from './beach-time-title';

export const BeachTimeSuccess: React.FC = () => {
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
					"Beach time" is an approximation of the time range when the beach is suitable to visit.
					Beach time is based on available data for tides, sunlight, and weather (excluding wind and temperature).
					It is assumed that the beach becomes accessible at a water level at or below <TideHeightTextUnit height={iso.constant.beachAccessHeight} precision={0} />.
					Data is not guaranteed accurate, and is less accurate the further it is based from the current time.
				</Note>
			</PanelPadding>
		</>
	);
};

export const BeachTime = wrapForBatchLoad(DefaultErrorLoad, BeachTimeSuccess);