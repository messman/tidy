import * as React from 'react';
import { StyledFC } from '@/index/core/primitive/primitive-styled';

function roundVal(num: number): number {
	return Math.round(num * 100) / 100;
}

export interface Rect {
	left: number,
	bottom: number;
	right: number,
	top: number,
}
export function makeRect(left: number, bottom: number, right: number, top: number): Rect {
	return { left, top, right, bottom };
}

export interface Point {
	x: number,
	y: number;
}

export interface ChartLineOutput {
	fillPath: string,
	strokePath: string;
}


export function createChartLine(points: Point[], sourceRect: Rect, destRect: Rect, destBottomPaddingFactor: number, destTopPaddingFactor: number): ChartLineOutput {
	// Coordinate system is from top left, but provided inputs are from bottom left
	const transform = getTransform(sourceRect, destRect);
	const destTotalScaleFactor = 1 - (destBottomPaddingFactor + destTopPaddingFactor);
	const destBottomAddition = destRect.top * destBottomPaddingFactor;
	points = points.map(function (p) {
		const tPoint = transform(p);

		// If we have padding to apply, apply it.
		// Remember we are not yet upside-down
		tPoint.y *= destTotalScaleFactor;
		tPoint.y += destBottomAddition;

		// Flip the y values because we want high values to actually be closer to 0 (the top).
		tPoint.y = roundVal(destRect.top - (tPoint.y - destRect.bottom));
		return tPoint;
	});

	const p1 = points[0];
	const p2 = points[1];
	const pLast = points[points.length - 1];
	const totalWidth = pLast.x - p1.x;
	const averageDistance = totalWidth / (points.length - 1);
	const controlPointLateral = averageDistance * .4;

	let bezier = `M${p1.x} ${p1.y} C ${roundVal(p1.x + controlPointLateral)} ${p1.y} ${roundVal(p2.x - controlPointLateral)} ${p2.y} ${p2.x} ${p2.y}`;

	for (let i = 2; i < points.length; i++) {
		const point = points[i];
		bezier += addToBezier({ x: roundVal(point.x - controlPointLateral), y: point.y }, point);
	}

	const strokePath = bezier;

	// Move horizontally not by the destRect bounds, but rather by the total width since we end outside of the rect.
	// Move up (down visually) to the destRect.top, which should be your max value. Then across, then back up to the start. 
	const fillPath = `${bezier} v${destRect.top - pLast.y} h${-totalWidth} v${-destRect.top - p1.y} z`;

	return {
		strokePath: strokePath,
		fillPath: fillPath
	};
}

function addToBezier(cp: Point, ep: Point): string {
	return ` S ${cp.x} ${cp.y} ${ep.x} ${ep.y}`;
}

function getTransform(source: Rect, dest: Rect): (p: Point) => Point {
	const xScale = (dest.right - dest.left) / (source.right - source.left);
	const yScale = (dest.top - dest.bottom) / (source.top - source.bottom);
	return function (point: Point): Point {
		return {
			x: roundVal(((point.x - source.left) * xScale) + dest.left),
			y: roundVal(((point.y - source.bottom) * yScale) + dest.bottom),
		};
	};
}

export interface SVGPathProps {
	destRect: Rect,
	path: string;
}

export const SVGPath: StyledFC<SVGPathProps> = (props) => {
	const { destRect, path } = props;
	const { left, bottom, right, top } = destRect;
	const width = right - left;
	const height = top - bottom;
	return (
		<svg className={props.className} version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox={`${left} ${bottom} ${width} ${height}`}>
			<path d={path}></path>
		</svg>
	);
};