import * as React from "react";
import { Flex } from "@/unit/components/flex";
import styled, { StyledFC } from "@/styles/styled";
import * as C from "@/styles/common";
import { useAppDataContext } from "@/tree/appData";
import { Point, createChartLine, ChartLineInput, makeRect, SVGPath } from "@/services/bezier";
import { useRef } from "react";
import { useElementSize } from "@/unit/hooks/useElementSize";
import { ExtremeCards } from "./extremeCards";

interface ChartForegroundProps {
}

export const ChartForeground: StyledFC<ChartForegroundProps> = () => {
	const { isLoading, success } = useAppDataContext();
	const ref = useRef<HTMLDivElement>(null!);
	const size = useElementSize(ref, 300);

	if (isLoading || !success) {
		return null;
	}

	let fillSVG: JSX.Element | null = null;
	let strokeSVG: JSX.Element | null = null;
	let lowerTimelinePadding: JSX.Element = <C.TimelinePadding />;

	if (size.width > 1 && size.height > 1) {
		lowerTimelinePadding = <LowerTimelinePadding />;

		const startTime = success.info.referenceTime;
		const endTime = success.data!.predictions.cutoffDate;


		const previous = success.data!.current.tides.previous;
		const tidePredictions = success.data!.predictions.tides;
		const allTides = [previous, ...tidePredictions.events];
		const points: Point[] = allTides.map(function (t) {
			return {
				x: t.time.getTime(),
				y: t.height
			};
		});

		const min = tidePredictions.lowest.height;
		const max = tidePredictions.highest.height;

		const chartLineInput: ChartLineInput = {
			points: points,
			closePath: true,
			sourceRect: makeRect(startTime.getTime(), min, endTime.getTime(), max),
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
			<C.TimelinePadding />
			<CardRefContainer ref={ref} >
				<ExtremeCards heightInPixels={size.height} />
			</CardRefContainer>
			{lowerTimelinePadding}
			{fillSVG}
			{strokeSVG}
		</>

	);
}

const CardRefContainer = styled(Flex)`
	z-index: 6;
`;

const LowerTimelinePadding = styled(C.TimelinePadding)`
	background-color: ${props => props.theme.color.background};
	opacity: .5;
`;


const FillSVG = styled(SVGPath)`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	fill: ${props => props.theme.color.background};
	opacity: .5;

	z-index: 5;
`;

const StrokeSVG = styled(SVGPath)`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	stroke: ${props => props.theme.color.background};
	stroke-width: 16px;
	fill: transparent;

	z-index: 7;
`;


