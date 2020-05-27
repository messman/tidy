/** [x, y] */
export type Point = [number, number];

// Test with https://tools.timodenk.com/polynomial-interpolation
export function quadraticFromPoints(pointA: Point, pointB: Point, pointC: Point): (x: number) => number {
	const [xA, yA] = pointA;
	const [xB, yB] = pointB;
	const [xC, yC] = pointC;

	return function (x: number) {
		return (
			(yA * (x - xB) * (x - xC) / ((xA - xB) * (xA - xC)))
			+ (yB * (x - xA) * (x - xC) / ((xB - xA) * (xB - xC)))
			+ (yC * (x - xA) * (x - xB) / ((xC - xA) * (xC - xB)))
		)
	};
}

// Slope-intercept
export function linearFromPoints(pointA: Point, pointB: Point): (x: number) => number {
	const [xA, yA] = pointA;
	const [xB, yB] = pointB;

	const m = (yB - yA) / (xB - xA);
	const b = yA - (m * xA);

	return function (x: number): number {
		return (m * x) + b;
	}
}