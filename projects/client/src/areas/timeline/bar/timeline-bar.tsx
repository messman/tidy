import * as React from 'react';
import { FlexColumn } from '@/core/layout/flex';
import { styled } from '@/core/style/styled';
import { TimelineBarAstro } from './timeline-bar-astro';
import { TimelineBaseProps } from './timeline-bar-common';
import { TimelineBarTide } from './timeline-bar-tide';
import { TimelineBarWeather } from './timeline-bar-weather';

export interface TimelineBarProps extends TimelineBaseProps { }

export const TimelineBar: React.FC<TimelineBarProps> = (props) => {

	const { timelineStartTime } = props;
	// Use flex 1 0 auto, meaning, "I can take up more space (vertically), but I won't shrink".
	// And when growing, center the content within.
	return (
		<FlexColumn flex='2 0 auto' justifyContent='center'>

			<BarPadding>
				<TimelineBarWeather timelineStartTime={timelineStartTime} />
			</BarPadding>
			<BarPadding>
				<TimelineBarAstro timelineStartTime={timelineStartTime} />
			</BarPadding>
			<BarPadding>
				<TimelineBarTide timelineStartTime={timelineStartTime} />
			</BarPadding>
		</FlexColumn>
	);
};

const BarPadding = styled.div`
	margin-top: 2.5rem;
	margin-bottom: 1rem;
`;