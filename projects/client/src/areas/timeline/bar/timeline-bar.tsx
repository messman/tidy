// import * as React from 'react';
// import { styled } from '@/core/theme/styled';
// import { TimelineBarAstro } from './timeline-bar-astro';
// import { TimelineBaseProps } from './timeline-bar-common';
// import { TimelineBarTide } from './timeline-bar-tide';
// import { TimelineBarWeather } from './timeline-bar-weather';

// export interface TimelineBarProps extends TimelineBaseProps {
// 	barWidth: number;
// }

// export const TimelineBar: React.FC<TimelineBarProps> = (props) => {

// 	const { timelineStartTime, barWidth } = props;
// 	return (
// 		<FlexColumn flex='0 0 auto' justifyContent='center'>

// 			<BarPadding>
// 				<TimelineBarWeather timelineStartTime={timelineStartTime} />
// 			</BarPadding>
// 			<BarPadding>
// 				<TimelineBarAstro timelineStartTime={timelineStartTime} barWidth={barWidth} />
// 			</BarPadding>
// 			<BarPadding>
// 				<TimelineBarTide timelineStartTime={timelineStartTime} />
// 			</BarPadding>
// 		</FlexColumn>
// 	);
// };

// const BarPadding = styled.div`
// 	padding-top: 2.3rem;
// 	padding-bottom: .85rem;
// 	overflow: hidden;
// `;