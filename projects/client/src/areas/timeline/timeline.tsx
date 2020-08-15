import * as React from 'react';
import { edgePaddingValue } from '@/core/style/common';
import { styled } from '@/core/style/styled';
import { CONSTANT } from '@/services/constant';
import { hasAllResponseData, useAllResponse } from '@/services/data/data';
import { pixelsToTime } from '@/services/time';
import { DefaultLayoutBreakpoint, FlexColumn, useControlledElementSize, useWindowDimensions } from '@messman/react-common';
import { TimelineBar } from './bar/timeline-bar';
import { TimelineChart } from './chart/timeline-chart';
import { TimelineBackground } from './timeline-background';
import { TimelineWeather } from './weather/timeline-weather';

export interface TimelineProps {
}

export const Timeline: React.FC<TimelineProps> = () => {

	const allResponseState = useAllResponse();
	const [ref, size] = useControlledElementSize(CONSTANT.elementSizeLargeThrottleTimeout);
	const dimensions = useWindowDimensions();
	if (!hasAllResponseData(allResponseState)) {
		return null;
	}
	const { all, info } = allResponseState.data!;

	/*
		If in compact view, we want our reference time to be exactly centered. Otherwise, we just need a fair amount of
		space to show where our reference time is.
	*/
	const useCompactView = false; //dimensions.width <= LayoutBreakpoint.regular; // disabled for now.

	const windowWidth = useCompactView ? dimensions.width : (DefaultLayoutBreakpoint.regular / 3);
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
			<TimelineBar timelineStartTime={startTime} barWidth={size.width} />
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
	width: 2px;
	height: 100%;
	background-color: ${p => p.theme.color.disabled};
	border-radius: 2px;
	opacity: .7;
`;


const CurrentTimeLineLegend = styled.div<CurrentTimeLineProps>`
	position: absolute;
	top: 4px;
	text-transform: uppercase;
	right: calc(100% - ${p => p.leftOffset}px);
	margin-right: ${edgePaddingValue};
	color: ${p => p.theme.color.disabled};
	opacity: .7;
`;