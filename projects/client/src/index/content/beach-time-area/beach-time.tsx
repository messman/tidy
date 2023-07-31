import * as React from 'react';
import { Block } from '@/index/core/layout/layout-shared';
import { PanelPadding } from '@/index/core/layout/panel/panel';
import { wrapForBatchLoad } from '@/index/core/loader/batch-load-control';
import { DefaultErrorLoad } from '@/index/core/loader/loader';
import * as iso from '@wbtdevlocal/iso';
import { TideHeightTextUnit } from '../common/tide/tide-common';
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
				"Beach time" is an approximation of the time range when the beach is suitable to visit.
				Beach time is based on available data for tides, sunlight, and weather (excluding wind and temperature).
				Beach space starts disappearing quickly when the rising tide passes <TideHeightTextUnit height={iso.constant.beachAccessEarlyRise} precision={0} />,
				and the beach opens back up when the falling tide passes <TideHeightTextUnit height={iso.constant.beachAccessFullyFall} precision={0} />.
				Data is not guaranteed accurate, and is less accurate the further it is based from the current time.
			</PanelPadding>
		</>
	);
};

export const BeachTime = wrapForBatchLoad(DefaultErrorLoad, BeachTimeSuccess);