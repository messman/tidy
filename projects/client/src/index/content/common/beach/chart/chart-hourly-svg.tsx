import { DateTime } from 'luxon';
import * as React from 'react';
import styled, { css } from 'styled-components';
import { createChartLine, makeRect, Point, SVGPath } from '@/index/core/draw/bezier';
import { themeTokens } from '@/index/core/theme/theme-root';
import { TidePointExtreme } from '@wbtdevlocal/iso';

const svgStyle = css`
	position: absolute;
	top: 0;
	left: 0;
	height: 100%;
	overflow: unset;
`;

export const FillSVG = styled(SVGPath)`
	${svgStyle}

	height: 100%;
	width: 100%;
	fill: ${themeTokens.background.tint.medium};
	opacity: 1;
`;

// export const StrokeSVG = styled(SVGPath)`
// 	${svgStyle}

// 	width: ${p => p.destRect.right - p.destRect.left}px;
// 	stroke: ${themeTokens.background.tint.medium};
// 	stroke-width: 6px;
// 	fill: transparent;
// `;

export interface ChartHourlySVGProps {
	day: DateTime;
	extrema: TidePointExtreme[];
	allExtremaMin: number;
	allExtremaMax: number;
	verticalPaddingFactor: number;
};

export const ChartHourlySVG: React.FC<ChartHourlySVGProps> = React.memo((props) => {
	const { day, extrema, allExtremaMin, allExtremaMax, verticalPaddingFactor } = props;

	const minX = day.startOf('day').valueOf();

	// Convert tide data into point data.
	const points = extrema.map<Point>((extreme) => {
		return {
			x: extreme.time.valueOf() - minX,
			y: extreme.height
		};
	});

	const viewBox = makeRect(0, allExtremaMin, day.endOf('day').valueOf() - minX, allExtremaMax);
	const output = createChartLine(points, viewBox, verticalPaddingFactor);

	return (
		<>
			<FillSVG path={output.fillPath} viewBox={viewBox} />
			{/* <StrokeSVG path={output.strokePath} destRect={destRect} /> */}
		</>
	);
});


// export interface TideChartInput {

// 	/** Range for which we are creating a chart. */
// 	tideEventRange: iso.Tide.TideEventRange;
// 	/** If true, the outside tide events will be considered in sizing the chart. Use true if you are showing some of the area outside the range. */
// 	includeOutsideRange: boolean;
// 	/** Start time, informing the left side visibility of our chart. */
// 	startTime: DateTime;
// 	/** End time, informing the right side visibility of our chart. */
// 	endTime: DateTime;
// 	/** Output width - probably pixels. */
// 	outputWidth: number;
// 	/** Output height - probably pixels. */
// 	outputHeight: number;
// 	/** Padding, in pixels, to apply within the output height (like with the box model). */
// 	outputPaddingTop: number;
// 	/** Padding, in pixels, to apply within the output height (like with the box model). */
// 	outputPaddingBottom: number;
// }

// /** Creates a chart output. Uses useMemo for basic optimization. */
// export function useTideChart(input: TideChartInput): JSX.Element | null {
// 	const { tideEventRange, includeOutsideRange, startTime, endTime, outputWidth, outputHeight, outputPaddingTop, outputPaddingBottom } = input;

// 	// TODO - are we allowed to use the input argument in the useMemo without exactly specifying it in the dependencies array?
// 	return React.useMemo(() => {
// 		return computeTideChartOutput(tideEventRange, includeOutsideRange, startTime, endTime, outputWidth, outputHeight, outputPaddingTop, outputPaddingBottom);
// 	}, [
// 		tideEventRange,
// 		includeOutsideRange,
// 		startTime,
// 		endTime,
// 		outputWidth,
// 		outputHeight,
// 		outputPaddingTop,
// 		outputPaddingBottom
// 	]);
// }

// function computeTideChartOutput(tideEventRange: iso.Tide.TideEventRange, includeOutsideRange: boolean, startTime: DateTime, endTime: DateTime, outputWidth: number, outputHeight: number, outputPaddingTop: number, outputPaddingBottom: number): JSX.Element | null {
// 	// May be we don't have width or height yet because it's being computed with a ref. 
// 	if (outputWidth < 1 || outputHeight < 1) {
// 		return null;
// 	}

// 	// Convert tide data into point data.
// 	const points = tideEventRangeToPoint(tideEventRange);

// 	// Min and max will make up our input Y values.
// 	let min = tideEventRange.lowest.height;
// 	let max = tideEventRange.highest.height;

// 	if (includeOutsideRange) {
// 		const [minOutside, maxOutside] = getMinMaxEvents([...tideEventRange.outsidePrevious, ...tideEventRange.outsideNext]);

// 		min = Math.min(min, minOutside.height);
// 		max = Math.max(max, maxOutside.height);
// 	}

// 	// Create our source rect - the data within will be transformed into destination rect data (pixels).
// 	const sourceRect = makeRect(startTime.valueOf(), min, endTime.valueOf(), max);
// 	const destRect = makeRect(0, 0, outputWidth, outputHeight);

// 	const topPaddingFactor = outputPaddingTop / outputHeight;
// 	const bottomPaddingFactor = outputPaddingBottom / outputHeight;

// 	const output = createChartLine(points, sourceRect, destRect, bottomPaddingFactor, topPaddingFactor);

// 	return (
// 		<>
// 			<FillSVG path={output.fillPath} destRect={destRect} />
// 			<StrokeSVG path={output.strokePath} destRect={destRect} />
// 		</>
// 	);
// }

// function tideEventRangeToPoint(tideEventRange: iso.Tide.TideEventRange): Point[] {
// 	const points = [
// 		...tideEventRange.outsidePrevious.map(tideStatusToPoint),
// 		...tideEventRange.events.map(tideStatusToPoint),
// 		...tideEventRange.outsideNext.map(tideStatusToPoint),
// 	];
// 	return points.filter<Point>((point): point is Point => {
// 		return !!point;
// 	});
// }

// function tideStatusToPoint(status: iso.Tide.TideStatus | null | undefined): Point | null {
// 	if (!status) {
// 		return null;
// 	}
// 	return {
// 		x: status!.time.valueOf(),
// 		y: status!.height
// 	};
// }

// export function getMinMaxEvents(events: iso.Tide.TideEvent[]): [iso.Tide.TideEvent, iso.Tide.TideEvent] {
// 	if (!events || !events.length) {
// 		throw new Error('Cannot get min and max of empty array');
// 	}
// 	let minHeight: number = Infinity;
// 	let maxHeight: number = -Infinity;

// 	let minEvent: iso.Tide.TideEvent = null!;
// 	let maxEvent: iso.Tide.TideEvent = null!;

// 	events.forEach(function (t) {
// 		if (t.height < minHeight) {
// 			minHeight = t.height;
// 			minEvent = t;
// 		}
// 		if (t.height > maxHeight) {
// 			maxHeight = t.height;
// 			maxEvent = t;
// 		}
// 	});

// 	return [minEvent, maxEvent];
// };