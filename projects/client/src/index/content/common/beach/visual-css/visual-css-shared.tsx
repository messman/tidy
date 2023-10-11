import * as React from 'react';
import { constant } from '@wbtdevlocal/iso';

/** The "front side", meaning the side that viewers see most that lends to the 3d effect. */
const objectFrontSideWidth = 150;
/** Depth, as in, the length of the beach-only side and length of the water-only side. */
const objectDepth = 100;
/** The height of just the sand. Used for matching up the diorama height of beach access to the real height. */
const objectSandHeight = 10;
/** The length needed for the sand at its slope to go from high to low. */
const sandHypotenuse = Math.sqrt(Math.pow(objectSandHeight, 2) + Math.pow(objectFrontSideWidth, 2));
/** The angle of decline for the sand. */
const sandAngleDeg = Math.atan(objectSandHeight / objectFrontSideWidth) * 180 / Math.PI;

export const visualCssConstant = {
	objectFrontSideWidth,
	objectDepth,
	objectSandHeight,
	sandHypotenuse,
	sandAngleDeg
};

export type WaterSideCompute = {
	/** The "width of the water surface" that is visible at the top of the diorama. */
	width: number;
	/** The height of the water that is used for the "triangle" up against the sand. This is clamped to not be taller than the sand itself. */
	heightTriangle: number;
	/** If the water level is higher than the sand, we should render additional rectangles atop our water triangles to continue the effect. */
	heightOverflow: number;
};

export function useWaterSideCompute(height: number): WaterSideCompute {

	return React.useMemo<WaterSideCompute>(() => {
		// Clamp the height so our animations never get too crazy.
		// diagramSandHeight / constant height = X / water level height
		const clampedHeight = Math.min(12, Math.max(0.5, height));
		// Get the total height the water should be.
		const waterSideHeight = (objectSandHeight * clampedHeight) / constant.beachAccess.bestGuessBeachHeight;
		// Get just the height we can draw with triangles.
		const clampedTriangleHeight = Math.min(objectSandHeight, waterSideHeight);
		// Get the angle of the triangle opposite of the downward sand slope.
		const complementaryAngle = 90 - sandAngleDeg;
		// Get the width of the triangle, matching the total width of the top of the water.
		const waterSideWidth = Math.tan(complementaryAngle / 180 * Math.PI) * clampedTriangleHeight;
		return {
			width: waterSideWidth,
			heightTriangle: clampedTriangleHeight,
			heightOverflow: Math.max(0, waterSideHeight - objectSandHeight)
		};
	}, [height]);
}