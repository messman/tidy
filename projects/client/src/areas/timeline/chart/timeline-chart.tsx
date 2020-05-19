import * as React from 'react';
import { useAllResponse, hasAllResponseData } from '@/services/data/data';
import { useElementSize } from '@/services/layout/element-size';
import { CONSTANT } from '@/services/constant';
import { css, styled } from '@/core/style/styled';
import { SVGPath, createChartLine as createChart, makeRect, Point } from '@/services/draw/bezier';
import { Flex } from '@/core/layout/flex';
import { timeToPixels } from '@/services/time';

export interface TimelineChartProps {
}

export const TimelineChart: React.FC<TimelineChartProps> = () => {

	const allResponseState = useAllResponse();

	const ref = React.useRef<HTMLDivElement>(null!);
	const size = useElementSize(ref, CONSTANT.elementSizeLargeThrottleTimeout);

	if (!hasAllResponseData(allResponseState)) {
		return null;
	}

	let fillSVG: JSX.Element | null = null;
	let strokeSVG: JSX.Element | null = null;

	if (size.width > 1 && size.height > 1) {

		const { all, info } = allResponseState.data!;
		const { tides, cutoffDate } = all.predictions;

		const allTides = [tides.outsidePrevious, ...tides.events, tides.outsideNext];
		const points: Point[] = allTides.map(function (t) {
			return {
				x: t!.time.valueOf(),
				y: t!.height
			};
		});

		let min = tides.lowest.height;
		let max = tides.highest.height;

		// instead of using size.width (which varies based on flex properties), use the cutoff date.
		// The chart line we create goes outside its own bounds to cover extra space!
		const width = timeToPixels(info.referenceTime, cutoffDate);
		const height = size.height;

		const sourceRect = makeRect(info.referenceTime.valueOf(), min, cutoffDate.valueOf(), max);
		const destRect = makeRect(0, 0, width, height);
		const bottomPaddingFactor = .1;
		const topPaddingFactor = .1;

		const output = createChart(points, sourceRect, destRect, bottomPaddingFactor, topPaddingFactor);
		fillSVG = <FillSVG path={output.fillPath} destRect={destRect} />
		strokeSVG = <StrokeSVG path={output.strokePath} destRect={destRect} />
	}

	// Use flex 2 1 0, which means "grow 2x as much as siblings, and allow me to shrink too"
	return (
		<>
			<ResizeContainer ref={ref} flex='2 1 0'>
				{fillSVG}
				{strokeSVG}
			</ResizeContainer>
		</>
	);
}

const svgStyle = css`
	position: absolute;
	top: 0;
	left: 0;
	height: 100%;
	overflow: unset;
`;

const FillSVG = styled(SVGPath)`
	${svgStyle}

	width: ${p => p.destRect.right - p.destRect.left}px;
	fill: ${p => p.theme.color.tide};
	opacity: .1;
`;

const StrokeSVG = styled(SVGPath)`
	${svgStyle}

	width: ${p => p.destRect.right - p.destRect.left}px;
	stroke: ${p => p.theme.color.tide};
	stroke-width: 4px;
	fill: transparent;
`;

const ResizeContainer = styled(Flex)`
	overflow: hidden;
`;