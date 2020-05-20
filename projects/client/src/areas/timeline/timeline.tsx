import * as React from 'react';
import { FlexColumn } from '@/core/layout/flex';
import { useElementSize } from '@/services/layout/element-size';
import { hasAllResponseData, useAllResponse } from '@/services/data/data';
import { TimelineBar } from './bar/timeline-bar';
import { TimelineWeather } from './weather/timeline-weather';
import { TimelineBackground } from './timeline-background';
import { TimelineChart } from './chart/timeline-chart';
import { CONSTANT } from '@/services/constant';

export interface TimelineProps {
}

export const Timeline: React.FC<TimelineProps> = () => {

	const allResponseState = useAllResponse();
	if (!hasAllResponseData(allResponseState)) {
		return null;
	}

	const ref = React.useRef<HTMLDivElement>(null);
	const size = useElementSize(ref, CONSTANT.elementSizeLargeThrottleTimeout, null);

	const { all, info } = allResponseState.data!;

	return (
		<FlexColumn ref={ref}>
			<TimelineBackground barWidth={size.width} />
			<TimelineWeather />
			<TimelineBar />
			<TimelineChart all={all} info={info} />
		</FlexColumn>

	);
};