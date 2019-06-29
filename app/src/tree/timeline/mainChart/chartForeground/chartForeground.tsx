import * as React from "react";
import { Flex, FlexRow, FlexColumn } from "@/unit/components/flex";
import styled, { css, ThemedCSS, StyledFC } from "@/styles/theme";
import * as C from "@/styles/common";
import { useAppDataContext } from "@/tree/appData";
import { timeToPixels, isSameDay } from "@/services/time";
import { Point, createChartLine } from "@/services/bezier";
import { useRef } from "react";
import { useElementSize } from "@/unit/hooks/useElementSize";

interface ChartForegroundProps {
}

export const ChartForeground: StyledFC<ChartForegroundProps> = (props) => {
	const { isLoading, success } = useAppDataContext();
	const ref = useRef<HTMLDivElement>(null);
	const size = useElementSize(ref, 300);

	if (isLoading || !success) {
		return null;
	}

	let fillSVG: JSX.Element = null;
	let strokeSVG: JSX.Element = null;
	let lowerTimelinePadding: JSX.Element = <C.TimelinePadding />;

	if (size.width > 1 && size.height > 1) {
		lowerTimelinePadding = <LowerTimelinePadding />;

		const startTime = success.info.time;
		const previous = success.success.current.tides.previous;
		const points: Point[] = [
			{
				x: timeToPixels(startTime, previous.time),
				y: previous.height
			}
		]
		success.success.predictions.tides.events.forEach(function (t) {
			points.push({
				x: timeToPixels(startTime, t.time),
				y: t.height
			});
		});
		const fill = createChartLine(points, 130, true, size.width, size.height);
		fillSVG = <FillSVG path={fill.path} width={fill.width} height={fill.height} />

		const stroke = createChartLine(points, 130, false, size.width, size.height);
		strokeSVG = <StrokeSVG path={stroke.path} width={stroke.width} height={stroke.height} />
	}


	return (
		<>
			<C.TimelinePadding />
			<Flex ref={ref} />
			{lowerTimelinePadding}
			{fillSVG}
			{strokeSVG}
		</>

	);
}

const LowerTimelinePadding = styled(C.TimelinePadding)`
	background-color: ${props => props.theme.color.bgMed};
	opacity: .5;
`;

export interface SVGPathProps {
	width: number,
	height: number,
	path: string
}

const _SVGPath: StyledFC<SVGPathProps> = (props) => {
	const { width, height, path } = props;
	return (
		<svg className={props.className} version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${width} ${height}`} >
			<path d={path}></path>
		</svg>
	);
}

const FillSVG = styled(_SVGPath)`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	fill: ${props => props.theme.color.bgMed};
	opacity: .5;
`;

const StrokeSVG = styled(_SVGPath)`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	stroke: ${props => props.theme.color.emphasis};
	stroke-width: 16px;
	fill: transparent;
`;


