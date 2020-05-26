import * as React from 'react';
import { FlexColumn } from '@/core/layout/flex';
import { edgePaddingValue } from '@/core/style/common';
import { styled } from '@/core/style/styled';
import { CONSTANT } from '@/services/constant';
import { hasAllResponseData, useAllResponse } from '@/services/data/data';
import { useElementSize } from '@/services/layout/element-size';
import { LayoutBreakpoint } from '@/services/layout/responsive-layout';
import { useWindowDimensions } from '@/services/layout/window-dimensions';
import { pixelsToTime } from '@/services/time';
import { TimelineBar } from './bar/timeline-bar';
import { TimelineChart } from './chart/timeline-chart';
import { TimelineBackground } from './timeline-background';
import { TimelineWeather } from './weather/timeline-weather';

export interface TimelineProps {
}

export const Timeline: React.FC<TimelineProps> = () => {

	const allResponseState = useAllResponse();
	const ref = React.useRef<HTMLDivElement>(null);
	const size = useElementSize(ref, CONSTANT.elementSizeLargeThrottleTimeout, null);
	const dimensions = useWindowDimensions();
	if (!hasAllResponseData(allResponseState)) {
		return null;
	}
	const { all, info } = allResponseState.data!;

	/*
		If in compact view, we want our reference time to be exactly centered. Otherwise, we just need a fair amount of
		space to show where our reference time is.
	*/
	const windowWidth = dimensions.width <= LayoutBreakpoint.regular ? dimensions.width : (LayoutBreakpoint.regular / 3);
	const offsetToReferenceTime = windowWidth / 2;
	const startTime = pixelsToTime(info.referenceTime, -offsetToReferenceTime);

	/*
		Structure:
		- FlexColumn is measured for width that is provided to the absolute elements - to create our background.
			- Children all have the same width thanks to Flex.
	*/
	return (
		<FlexColumn ref={ref}>
			<TimelineBackground timelineStartTime={startTime} barWidth={size.width} />
			<CurrentTimeLine leftOffset={offsetToReferenceTime} />
			<CurrentTimeLineLegend leftOffset={offsetToReferenceTime} >Now</CurrentTimeLineLegend>
			<TimelineWeather timelineStartTime={startTime} />
			<TimelineBar timelineStartTime={startTime} />
			<TimelineChart timelineStartTime={startTime} all={all} info={info} />
		</FlexColumn>

	);
};

interface CurrentTimeLineProps {
	leftOffset: number;
}

const CurrentTimeLine = styled.div<CurrentTimeLineProps>`
	position: absolute;
	top: 0px;
	left: ${p => p.leftOffset}px;
	width: 3px;
	height: 100%;
	background-color: ${p => p.theme.color.context};
	border-radius: 2px;
	opacity: .5;
`;


const CurrentTimeLineLegend = styled.div<CurrentTimeLineProps>`
	position: absolute;
	top: 0px;
	right: calc(100% - ${p => p.leftOffset}px);
	margin-right: ${edgePaddingValue};
	color: ${p => p.theme.color.context};
	opacity: .5;
	text-transform: uppercase;
`;