import * as React from 'react';
import { Flex } from '@/core/layout/flex';
import { useElementSize } from '@/services/layout/element-size';
import { hasAllResponseData, useAllResponse } from '@/services/data/data';
import { TimelineBar } from './bar/timeline-bar';
import { TimelineWeather } from './weather/timeline-weather';

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
		<Flex ref={ref}>
			<TimelineWeather />
			<TimelineBar />
		</Flex>
	);
}