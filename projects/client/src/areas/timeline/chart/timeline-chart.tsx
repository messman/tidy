import * as React from 'react';
import { AllResponseData, Info } from 'tidy-shared';
import { Flex } from '@/core/layout/flex';
import { styled } from '@/core/style/styled';
import { useTideChart } from '@/core/tide/tide-chart';
import { CONSTANT } from '@/services/constant';
import { useElementSize } from '@/services/layout/element-size';
import { timeToPixels } from '@/services/time';
import { TimelineBaseProps } from '../bar/timeline-bar-common';

export interface TimelineChartProps extends TimelineBaseProps {
	all: AllResponseData;
	info: Info;
}

const timelineChartPaddingTop = 10;
const timelineChartPaddingBottom = 30;

/** Creates a timeline chart specific to the timeline area - flexes its space and maintains the pixel-per-hour ratio. */
export const TimelineChart: React.FC<TimelineChartProps> = (props) => {

	const ref = React.useRef<HTMLDivElement>(null!);
	const size = useElementSize(ref, CONSTANT.elementSizeLargeThrottleTimeout, null);

	const { all, timelineStartTime } = props;
	const { tides, cutoffDate } = all.predictions;

	// Instead of using size.width (which varies based on flex properties), use the cutoff date.
	// We want our width to stay equal to our pixelsPerHour ratio.
	// The chart line we create goes outside its own bounds to cover extra space, so we shouldn't have an issue.
	const width = timeToPixels(timelineStartTime, cutoffDate);

	const tideChart = useTideChart({
		tideEventRange: tides,
		startTime: timelineStartTime,
		endTime: cutoffDate,
		outputWidth: width,
		outputHeight: size.height,
		outputPaddingTop: timelineChartPaddingTop,
		outputPaddingBottom: timelineChartPaddingBottom
	});

	// Use flex 2 1 0, which means "grow 2x as much as siblings, and allow me to shrink too".
	// Our ResizeContainer should size from the parent via Flex.
	return (
		<>
			<ResizeContainer ref={ref} flex='3 1 150px'>
				{tideChart}
			</ResizeContainer>
		</>
	);
};

const ResizeContainer = styled(Flex)`
	/** Don't allow our chart lines to go outside this container. */
	overflow: hidden;
`;