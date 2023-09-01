import * as React from 'react';
import { useBatchResponseSuccess } from '@/index/core/data/data';
import { Panel, PanelPadding } from '@/index/core/layout/layout-panel';
import { getDateLong } from '@/index/core/time/time';
import { BeachTimeDay } from '@wbtdevlocal/iso';
import { BeachChart } from '../common/beach/chart/chart';

export interface WeekDayBeachProps {
	day: BeachTimeDay;
	isTop: boolean;
	isBottom: boolean;
};

export const WeekDayBeach: React.FC<WeekDayBeachProps> = (props) => {
	const { day, isTop, isBottom } = props;
	const { meta } = useBatchResponseSuccess();

	return (
		<Panel
			title={isTop ? getDateLong(day.day, meta.referenceTime) : undefined}
			croppedTop={!isTop}
			croppedBottom={!isBottom}
		>
			<PanelPadding>
				<BeachChart day={day} />
			</PanelPadding>
		</Panel>
	);
};