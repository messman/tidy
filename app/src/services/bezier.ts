
function roundPercent(outOf1: number): string {
	return Math.round(outOf1 * 100).toString();
}

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
	let waveBezier = "";
	for (let i = 0; i < freq; i++)
		waveBezier += singleWaveBezier + " ";
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
	// "m0 (Y amount for percent) (bezier) (bezier) v(total - Y amount for percent) h-(2 * total width) v-(total - y amount for percent) z"
	return `M0 ${y} ${waveBezier} ${waveBezier} v${totalHeight - y} h-${totalWidth * 2} v-${totalHeight - y} z`
	// M0,${p} c13,0 20.3,-${r} 33.3,-${r} c13,0 20.3,${r} 33.3,${r} c13,0 20.3,-${r} 33.3,-${r} v100 h-100 v-${100 - p} z
}

export interface Point {
	x: number,
	y: number
}

interface ChartLineOutput {
	path: string,
	width: number,
	height: number
}

export function createChartLine(points: Point[], controlPointLateral: number, close: boolean, scaleToX: number, scaleToY: number): ChartLineOutput {
	// Coordinate system is from top left

	let minY = Infinity;
	let maxY = -Infinity;
	let minX = Infinity;
	let maxX = -Infinity;
	points.forEach(function (p) {
		minY = Math.min(minY, p.y);
		maxY = Math.max(maxY, p.y);
		minX = Math.min(minX, p.x);
		maxX = Math.max(maxX, p.x);
	});
	const scaleFactorX = scaleToX / maxX;
	const scaleFactorY = scaleToY / maxY;
	minY *= scaleFactorY;
	maxY *= scaleFactorY;
	minX *= scaleFactorX;
	maxX *= scaleFactorX;
	maxY = maxY - minY;
	console.log(scaleToX, maxX, scaleToY, maxY)
	points = points.map(function (p) {
		const x = p.x * scaleFactorX;
		const y = p.y * scaleFactorY;
		return {
			x: roundVal(x),
			y: roundVal(maxY - (y - minY))
		};
	});

	const p1 = points[0];
	const p2 = points[1];
	let bezier = `M${p1.x} ${p1.y} C ${p1.x + controlPointLateral} ${p1.y} ${p2.x - controlPointLateral} ${p2.y} ${p2.x} ${p2.y}`;

	for (let i = 2; i < points.length; i++) {
		const point = points[i];
		bezier += addToBezier({ x: point.x - controlPointLateral, y: point.y }, point);
	}

	let fullPath = bezier;
	if (close) {
		const pLast = points[points.length - 1];
		fullPath = `${bezier} v${maxY - pLast.y} h${-maxX} v${-maxY - p1.y} z`
	}

	return {
		path: fullPath,
		width: maxX,
		height: maxY
	}
}

function addToBezier(cp: Point, ep: Point): string {
	return ` S ${cp.x} ${cp.y} ${ep.x} ${ep.y}`;
}