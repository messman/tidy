import * as React from "react";
import styled, { StyledFC } from "@/styles/theme";
import { Point, createChartLine, ChartLineInput, makeRect, SVGPath } from "@/services/bezier";
import { useRef } from "react";
import { useElementSize } from "@/unit/hooks/useElementSize";
import { DailyInfo } from "../../../../../data";

interface ChartForegroundProps {
	minHour: number,
	maxHour: number,
	minTideHeight: number,
	maxTideHeight: number,
	dailyEvent: DailyInfo
}

export const ChartForeground: StyledFC<ChartForegroundProps> = (props) => {
	const ref = useRef<HTMLDivElement>(null);
	const size = useElementSize(ref, 300);

	let fillSVG: JSX.Element = null;
	let strokeSVG: JSX.Element = null;

	if (size.width > 1 && size.height > 1) {

		const tides = props.dailyEvent.tides;
		const day = props.dailyEvent.date;

		const startTime = new Date(day);
		startTime.setHours(props.minHour, 0, 0, 0);

		const endTime = new Date(day);
		endTime.setHours(props.maxHour, 0, 0, 0);

		const points: Point[] = tides.map(function (tide) {
			return {
				x: tide.time.getTime(),
				y: tide.height
			}
		});

		const chartLineInput: ChartLineInput = {
			points: points,
			controlPointLateral: 100,
			closePath: true,
			sourceRect: makeRect(startTime.getTime(), props.minTideHeight, endTime.getTime(), props.maxTideHeight),
			destRect: makeRect(0, 0, size.width, size.height),
		};
		const fill = createChartLine(chartLineInput);
		fillSVG = <FillSVG path={fill.path} destRect={chartLineInput.destRect} />

		chartLineInput.closePath = false;
		const stroke = createChartLine(chartLineInput);
		strokeSVG = <StrokeSVG path={stroke.path} destRect={chartLineInput.destRect} />
	}


	return (
		<Container ref={ref} >
			{fillSVG}
			{strokeSVG}
		</Container>
	);
}

const Container = styled.div`
	position: relative;
	height: 6rem;
`;

const FillSVG = styled(SVGPath)`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	fill: ${props => props.theme.color.bgMed};
	opacity: .5;

	z-index: 5;
`;

const StrokeSVG = styled(SVGPath)`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	stroke: ${props => props.theme.color.emphasis};
	stroke-width: 12px;
	fill: transparent;

	z-index: 7;
`;


