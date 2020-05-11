import * as React from 'react';
import { StyledFC } from '@/core/style/styled';

function roundVal(num: number): number {
	return Math.round(num * 100) / 100;
}

export function getPath(totalWidth: number, totalHeight: number, topPadding: number, bottomPadding: number, heightPercent: number, offset: number, amplitude: number, freq: number): string {
	// Coordinate system is from top left
	let y = (totalHeight - topPadding - bottomPadding) * (1 - heightPercent);
	y = y + topPadding - offset;
	y = roundVal(y);

	const period = totalWidth / freq;
	const bezierLength = period / 2;
	const cp1Length = roundVal(bezierLength / 3);
	const cp2Length = roundVal(bezierLength - cp1Length);

	// Firefox: path cannot use commas
	// Bezier is relative to start point of the bezier, not absolute
	// c (first control point) (second control point) (how far to actually go)
	const singleWaveBezier = `c ${cp1Length} -${amplitude} ${cp2Length} -${amplitude} ${bezierLength} 0 c${cp1Length} ${amplitude} ${cp2Length} ${amplitude} ${bezierLength} 0`;
	let waveBezier = '';
	for (let i = 0; i < freq; i++)
		waveBezier += singleWaveBezier + ' ';
	/*
		One wave:
			 ____
			/    \
		(A)/      \       /
				   \     /
					-----
		Where (A) is the top distance 
	*/

	// Make 2 waves (first of which covers the whole viewbox - second of which is completely offscreen) so we are 2X the viewbox width
	// Coordinate system is from top left
	// 'm0 (Y amount for percent) (bezier) (bezier) v(total - Y amount for percent) h-(2 * total width) v-(total - y amount for percent) z'
	return `M0 ${y} ${waveBezier} ${waveBezier} v${totalHeight - y} h-${totalWidth * 2} v-${totalHeight - y} z`;
	// M0,${p} c13,0 20.3,-${r} 33.3,-${r} c13,0 20.3,${r} 33.3,${r} c13,0 20.3,-${r} 33.3,-${r} v100 h-100 v-${100 - p} z
}

export interface Rect {
	left: number,
	bottom: number
	right: number,
	top: number,
}
export function makeRect(left: number, bottom: number, right: number, top: number): Rect {
	return { left, top, right, bottom };
}

export interface Point {
	x: number,
	y: number
}
export function makePoint(x: number, y: number): Point {
	return { x, y };
}

export interface ChartLineInput {
	points: Point[],
	// Close the path when doing a fill - but not for a path.
	closePath: boolean,
	sourceRect: Rect,
	destRect: Rect
}

export interface ChartLineOutput {
	path: string,
}

export function createChartLine(input: ChartLineInput): ChartLineOutput {
	// Coordinate system is from top left, but provided inputs are from bottom left

	const transform = getTransform(input.sourceRect, input.destRect);
	const points = input.points.map(function (p) {
		const tPoint = transform(p);
		// Flip the y values because we want high values to actually be closer to 0 (the top).
		tPoint.y = roundVal(input.destRect.top - (tPoint.y - input.destRect.bottom));
		return tPoint;
	});

	const p1 = points[0];
	const p2 = points[1];
	const pLast = points[points.length - 1];
	const totalWidth = pLast.x - p1.x;
	const averageDistance = totalWidth / (points.length - 1);
	const controlPointLateral = averageDistance * .4;

	//const controlPointLateral = input.controlPointLateral;
	let bezier = `M${p1.x} ${p1.y} C ${roundVal(p1.x + controlPointLateral)} ${p1.y} ${roundVal(p2.x - controlPointLateral)} ${p2.y} ${p2.x} ${p2.y}`;

	for (let i = 2; i < points.length; i++) {
		const point = points[i];
		bezier += addToBezier({ x: roundVal(point.x - controlPointLateral), y: point.y }, point);
	}

	let fullPath = bezier;
	if (input.closePath) {
		// Move horizontally not by the destRect bounds, but rather by the total width since we end outside of the rect.
		// Move up (down visually) to the destRect.top, which should be your max value. Then across, then back up to the start. 
		fullPath = `${bezier} v${input.destRect.top - pLast.y} h${-totalWidth} v${-input.destRect.top - p1.y} z`
	}

	return {
		path: fullPath
	}
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
		}
	}
}

export interface SVGPathProps {
	destRect: Rect,
	path: string
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
}