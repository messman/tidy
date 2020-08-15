import * as React from 'react';
import { borderRadiusStyle, edgePaddingValue } from '@/core/style/common';
import { css, styled } from '@/core/style/styled';
import { useTideChart } from '@/core/tide/tide-chart';
import { CONSTANT } from '@/services/constant';
import { hasAllResponseData, useAllResponse } from '@/services/data/data';
import { pixelsToTime, timeToPixels } from '@/services/time';
import { Flex, useControlledElementSize } from '@messman/react-common';

export interface SummaryTideChartProps {
}

const chartPaddingTop = 20;
const chartPaddingBottom = 20;

export const SummaryTideChart: React.FC<SummaryTideChartProps> = () => {

	const allResponseState = useAllResponse();
	const [ref, size] = useControlledElementSize(CONSTANT.elementSizeLargeThrottleTimeout);
	if (!hasAllResponseData(allResponseState)) {
		return null;
	}
	const { all, info } = allResponseState.data!;
	const { tides } = all.predictions;

	const offsetToReferenceTime = size.width / 2;
	const startTime = pixelsToTime(info.referenceTime, -offsetToReferenceTime);
	const stopTime = pixelsToTime(info.referenceTime, offsetToReferenceTime);

	const width = timeToPixels(startTime, stopTime);

	const tideChart = useTideChart({
		tideEventRange: tides,
		includeOutsideRange: false,
		startTime: startTime,
		endTime: stopTime,
		outputWidth: width,
		outputHeight: size.height,
		outputPaddingTop: chartPaddingTop,
		outputPaddingBottom: chartPaddingBottom
	});

	return (
		<ResizeContainer ref={ref} flex={1}>
			<TopBar />
			<BottomBar />
			<CurrentLine />
			{tideChart}
		</ResizeContainer>
	);
};

const ResizeContainer = styled(Flex)`
	/** Don't allow our chart lines to go outside this container. */
	overflow: hidden;
	${borderRadiusStyle};
	margin: ${edgePaddingValue};
`;

const barWidth = 18;
const lineWidth = 3;

const barStyles = css`
	position: absolute;
	left: calc(50% - ${barWidth / 2}px);
	width: ${barWidth}px;
	height: ${lineWidth}px;
	background-color: ${p => p.theme.color.backgroundLighter};
`;

const TopBar = styled.div`
	${barStyles};
	top: ${chartPaddingTop - (lineWidth / 2)}px;
`;

const CurrentLine = styled.div`
	position: absolute;
	top: ${chartPaddingTop}px;
	left: calc(50% - ${lineWidth / 2}px);
	width: ${lineWidth}px;
	height: calc(100% - ${chartPaddingTop + chartPaddingBottom}px);
	background-color: ${p => p.theme.color.backgroundLighter};
`;

const BottomBar = styled.div`
	${barStyles};
	bottom: ${chartPaddingBottom - (lineWidth / 2)}px;
`;
