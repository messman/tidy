import * as React from 'react';
import { styled } from '@/core/style/styled';
import { FlexColumn } from '@messman/react-common';
import { TimelineBarAstro } from './timeline-bar-astro';
import { TimelineBaseProps } from './timeline-bar-common';
import { TimelineBarTide } from './timeline-bar-tide';
import { TimelineBarWeather } from './timeline-bar-weather';

export interface TimelineBarProps extends TimelineBaseProps {
	barWidth: number;
}

export const TimelineBar: React.FC<TimelineBarProps> = (props) => {

	const { timelineStartTime, barWidth } = props;
	// Use flex 1 0 auto, meaning, "I can take up more space (vertically), but I won't shrink".
	// And when growing, center the content within.
	return (
		<FlexColumn flex='2 0 auto' justifyContent='center'>

			<BarPadding>
				<TimelineBarWeather timelineStartTime={timelineStartTime} />
			</BarPadding>
			<BarPadding>
				<TimelineBarAstro timelineStartTime={timelineStartTime} barWidth={barWidth} />
			</BarPadding>
			<BarPadding>
				<TimelineBarTide timelineStartTime={timelineStartTime} />
			</BarPadding>
		</FlexColumn>
	);
};

const BarPadding = styled.div`
	padding-top: 2.5rem;
	padding-bottom: 1rem;
	overflow: hidden;
`;