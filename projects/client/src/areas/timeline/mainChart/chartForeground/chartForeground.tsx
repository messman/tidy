import * as React from 'react';
import { Flex } from '@/core/layout/flex';
import { styled, StyledFC } from '@/core/style/styled';
import { useAllResponse, hasAllResponseData } from '@/services/data/data';
import { Point, createChartLine, ChartLineInput, makeRect, SVGPath } from '@/services/draw/bezier';
import { useElementSize } from '@/services/layout/element-size';
import { ExtremeCards } from './extremeCards';
import { CONSTANT } from '@/services/constant';

interface ChartForegroundProps {
}

export const ChartForeground: StyledFC<ChartForegroundProps> = () => {
	const allResponseState = useAllResponse();
	const ref = React.useRef<HTMLDivElement>(null!);
	const size = useElementSize(ref, CONSTANT.elementSizeLargeThrottleTimeout);

	if (!hasAllResponseData(allResponseState)) {
		return null;
	}

	let fillSVG: JSX.Element | null = null;
	let strokeSVG: JSX.Element | null = null;

	if (size.width > 1 && size.height > 1) {

		const data = allResponseState.data!;
		const startTime = data.info.referenceTime;
		const endTime = data.all.predictions.cutoffDate;


		const previous = data.all.current.tides.previous;
		const tidePredictions = data.all.predictions.tides;
		const allTides = [previous, ...tidePredictions.events];
		const points: Point[] = allTides.map(function (t) {
			return {
				x: t.time.valueOf(),
				y: t.height
			};
		});

		const min = tidePredictions.lowest.height;
		const max = tidePredictions.highest.height;

		const chartLineInput: ChartLineInput = {
			points: points,
			closePath: true,
			sourceRect: makeRect(startTime.valueOf(), min, endTime.valueOf(), max),
			destRect: makeRect(0, 0, size.width, size.height),
		};

		const fill = createChartLine(chartLineInput);
		fillSVG = <FillSVG path={fill.path} destRect={chartLineInput.destRect} />

		chartLineInput.closePath = false;
		const stroke = createChartLine(chartLineInput);
		strokeSVG = <StrokeSVG path={stroke.path} destRect={chartLineInput.destRect} />
	}


	return (
		<>
			<CardRefContainer ref={ref} >
				<ExtremeCards heightInPixels={size.height} />
			</CardRefContainer>
			{fillSVG}
			{strokeSVG}
		</>

	);
}

const CardRefContainer = styled(Flex)`
	z-index: 6;
`;

const FillSVG = styled(SVGPath)`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	fill: ${p => p.theme.color.background};
	opacity: .5;

	z-index: 5;
`;

const StrokeSVG = styled(SVGPath)`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	stroke: ${p => p.theme.color.background};
	stroke-width: 16px;
	fill: transparent;

	z-index: 7;
`;


