import * as React from 'react';
import { FlexColumn } from '@/core/layout/flex';
import { useElementSize } from '@/services/layout/element-size';
import { hasAllResponseData, useAllResponse } from '@/services/data/data';
import { TimelineBar } from './bar/timeline-bar';
import { TimelineWeather } from './weather/timeline-weather';
import { TimelineBackground } from './timeline-background';
import { TimelineChart } from './chart/timeline-chart';

export interface TimelineProps {
}

export const Timeline: React.FC<TimelineProps> = () => {

	const allResponseState = useAllResponse();
	if (!hasAllResponseData(allResponseState)) {
		return null;
	}

	const ref = React.useRef<HTMLDivElement>(null);
	const size = useElementSize(ref);

	if (size.width > 1 && size.height > 1) {

	}

	return (
		<FlexColumn ref={ref}>
			<TimelineBackground barWidth={size.width} />
			<TimelineWeather />
			<TimelineBar />
			<TimelineChart />
		</FlexColumn>

	);
}