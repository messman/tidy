import * as React from 'react';
import { useElementSize } from '@/services/layout/element-size';
import { CONSTANT } from '@/services/constant';
import { styled } from '@/core/style/styled';
import { Flex } from '@/core/layout/flex';
import { timeToPixels } from '@/services/time';
import { useTideChart } from '@/core/tide/tide-chart';
import { AllResponseData, Info } from 'tidy-shared';

export interface TimelineChartProps {
	/** Required to exist. */
	all: AllResponseData,
	/** Required to exist. */
	info: Info;
}

/** Creates a timeline chart specific to the timeline area - flexes its space and maintains the pixel-per-hour ratio. */
export const TimelineChart: React.FC<TimelineChartProps> = (props) => {

	const ref = React.useRef<HTMLDivElement>(null!);
	const size = useElementSize(ref, CONSTANT.elementSizeLargeThrottleTimeout, null);

	const { all, info } = props;
	const { tides, cutoffDate } = all.predictions;

	// Instead of using size.width (which varies based on flex properties), use the cutoff date.
	// We want our width to stay equal to our pixelsPerHour ratio.
	// The chart line we create goes outside its own bounds to cover extra space, so we shouldn't have an issue.
	const width = timeToPixels(info.referenceTime, cutoffDate);

	const tideChart = useTideChart({
		tideEventRange: tides,
		startTime: info.referenceTime,
		endTime: cutoffDate,
		outputWidth: width,
		outputHeight: size.height,
		outputPaddingTop: 30,
		outputPaddingBottom: 30
	});

	// Use flex 2 1 0, which means "grow 2x as much as siblings, and allow me to shrink too".
	// Our ResizeContainer should size from the parent via Flex.
	return (
		<>
			<ResizeContainer ref={ref} flex='2 1 0'>
				{tideChart}
			</ResizeContainer>
		</>
	);
};

const ResizeContainer = styled(Flex)`
	/** Don't allow our chart lines to go outside this container. */
	overflow: hidden;
`;