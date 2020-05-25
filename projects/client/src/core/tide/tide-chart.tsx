import { DateTime } from 'luxon';
import * as React from 'react';
import { TideEventRange, TideStatus } from 'tidy-shared';
import { createChartLine, makeRect, Point } from '@/services/draw/bezier';
import { FillSVG, StrokeSVG } from './tide-common';

export interface TideChartInput {
	/** Range for which we are creating a chart. */
	tideEventRange: TideEventRange,
	/** Start time, informing the left side visibility of our chart. */
	startTime: DateTime,
	/** End time, informing the right side visibility of our chart. */
	endTime: DateTime,
	/** Output width - probably pixels. */
	outputWidth: number,
	/** Output height - probably pixels. */
	outputHeight: number,
	/** Padding, in pixels, to apply within the output height (like with the box model). */
	outputPaddingTop: number,
	/** Padding, in pixels, to apply within the output height (like with the box model). */
	outputPaddingBottom: number;
}

/** Creates a chart output. Uses useMemo for basic optimization. */
export function useTideChart(input: TideChartInput): JSX.Element | null {
	const { tideEventRange, startTime, endTime, outputWidth, outputHeight, outputPaddingTop, outputPaddingBottom } = input;

	// TODO - are we allowed to use the input argument in the useMemo without exactly specifying it in the dependencies array?
	return React.useMemo(() => {
		return computeTideChartOutput(tideEventRange, startTime, endTime, outputWidth, outputHeight, outputPaddingTop, outputPaddingBottom);
	}, [
		tideEventRange,
		startTime,
		endTime,
		outputWidth,
		outputHeight,
		outputPaddingTop,
		outputPaddingBottom
	]);
}

function computeTideChartOutput(tideEventRange: TideEventRange, startTime: DateTime, endTime: DateTime, outputWidth: number, outputHeight: number, outputPaddingTop: number, outputPaddingBottom: number): JSX.Element | null {
	// May be we don't have width or height yet because it's being computed with a ref. 
	if (outputWidth < 1 || outputHeight < 1) {
		return null;
	}

	// Convert tide data into point data.
	const points = tideEventRangeToPoint(tideEventRange);

	// Min and max will make up our input Y values.
	let min = tideEventRange.lowest.height;
	let max = tideEventRange.highest.height;

	// Create our source rect - the data within will be transformed into destination rect data (pixels).
	const sourceRect = makeRect(startTime.valueOf(), min, endTime.valueOf(), max);
	const destRect = makeRect(0, 0, outputWidth, outputHeight);

	const topPaddingFactor = outputPaddingTop / outputHeight;
	const bottomPaddingFactor = outputPaddingBottom / outputHeight;

	const output = createChartLine(points, sourceRect, destRect, bottomPaddingFactor, topPaddingFactor);

	return (
		<>
			<FillSVG path={output.fillPath} destRect={destRect} />
			<StrokeSVG path={output.strokePath} destRect={destRect} />
		</>
	);
}

function tideEventRangeToPoint(tideEventRange: TideEventRange): Point[] {
	const points = [
		...tideEventRange.outsidePrevious.map(tideStatusToPoint),
		...tideEventRange.events.map(tideStatusToPoint),
		...tideEventRange.outsideNext.map(tideStatusToPoint),
	];
	return points.filter<Point>((point): point is Point => {
		return !!point;
	});
}

function tideStatusToPoint(status: TideStatus | null | undefined): Point | null {
	if (!status) {
		return null;
	}
	return {
		x: status!.time.valueOf(),
		y: status!.height
	};
}