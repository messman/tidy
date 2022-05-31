// import * as React from 'react';
// import { borderRadiusStyle, Spacing } from '@/core/theme/box';
// import { css, styled } from '@/core/theme/styled';
// import { useTideChart } from '@/core/tide/tide-chart';
// import { CONSTANT } from '@/services/constant';
// import { useBatchLatestResponse } from '@/services/data/data';
// import { pixelsToTime, timeToPixels } from '@/services/time';
// import { useControlledElementSize } from '@messman/react-common';

// export interface SummaryTideChartProps {
// }

// const chartPaddingTop = 20;
// const chartPaddingBottom = 20;

// export const SummaryTideChart: React.FC<SummaryTideChartProps> = () => {

// 	const { success } = useBatchLatestResponse();
// 	const [ref, size] = useControlledElementSize(CONSTANT.elementSizeLargeThrottleTimeout);
// 	if (!success) {
// 		return null;
// 	}
// 	const { meta, predictions } = success;

// 	const offsetToReferenceTime = size.width / 2;
// 	const startTime = pixelsToTime(meta.referenceTime, -offsetToReferenceTime);
// 	const stopTime = pixelsToTime(meta.referenceTime, offsetToReferenceTime);

// 	const width = timeToPixels(startTime, stopTime);

// 	const tideChart = useTideChart({
// 		tideEventRange: predictions.tides,
// 		includeOutsideRange: false,
// 		startTime: startTime,
// 		endTime: stopTime,
// 		outputWidth: width,
// 		outputHeight: size.height,
// 		outputPaddingTop: chartPaddingTop,
// 		outputPaddingBottom: chartPaddingBottom
// 	});

// 	return (
// 		<ResizeContainer ref={ref}>
// 			<TopBar />
// 			<BottomBar />
// 			<CurrentLine />
// 			{tideChart}
// 		</ResizeContainer>
// 	);
// };

// const ResizeContainer = styled.div`
// 	flex: 1;
// 	/** Don't allow our chart lines to go outside this container. */
// 	overflow: hidden;
// 	${borderRadiusStyle};
// 	margin: ${Spacing.dog16};
// `;

// const barWidth = 18;
// const lineWidth = 3;

// const barStyles = css`
// 	position: absolute;
// 	left: calc(50% - ${barWidth / 2}px);
// 	width: ${barWidth}px;
// 	height: ${lineWidth}px;
// 	background-color: #FFF;
// `;

// const TopBar = styled.div`
// 	${barStyles};
// 	top: ${chartPaddingTop - (lineWidth / 2)}px;
// `;

// const CurrentLine = styled.div`
// 	position: absolute;
// 	top: ${chartPaddingTop}px;
// 	left: calc(50% - ${lineWidth / 2}px);
// 	width: ${lineWidth}px;
// 	height: calc(100% - ${chartPaddingTop + chartPaddingBottom}px);
// 	background-color: #FFF;
// `;

// const BottomBar = styled.div`
// 	${barStyles};
// 	bottom: ${chartPaddingBottom - (lineWidth / 2)}px;
// `;
