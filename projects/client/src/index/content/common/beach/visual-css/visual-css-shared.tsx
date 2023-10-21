import * as React from 'react';
import { css } from 'styled-components';
import { constant } from '@wbtdevlocal/iso';

/*
	Top-Down View:

	* Road
	* v
	* v
	* v
	* Wall
	* v
	* Sand that is angled down
	* v
	* v
	* v
	* v           Water v
	* v                 v
	* v                 v
	* v                 v
	* v                 v
	* Sand evened out   v
	* v                 v
	* v                 v
	* v                 v
	* v                 v

	Cross-section:

		  Wall
	Road  ----
	------    
			  **              Water
							* ---------------------------------
										 * 
	0									                    * 
																			  * 
*/

export const perspectiveStyle = css`
	perspective: 200000px; // Ridiculously high value required for iOS
`;

const platformBaseSize = 10;
const platformOffsetSize = 0;

const platformWidthBeachLength = 200;

const platformHeightBufferEachEnd = 20;
const platformHeightWallToMinTide = 160;

const roadDepth = platformHeightBufferEachEnd;
const roadHeight = 30;

const wallHeight = 32;
const wallDepth = 9;

const sandHeight = 16;
const sandAdjacentFlat = platformHeightWallToMinTide + platformHeightBufferEachEnd;
const sandHypotenuse = Math.sqrt(Math.pow(sandHeight, 2) + Math.pow(sandAdjacentFlat, 2));
const sandAngleDeg = Math.atan(sandHeight / sandAdjacentFlat) * 180 / Math.PI;

const sandFoamBuffer = 3;

const waterAnimationHeight = 1;

const platformHeightTotal = roadDepth + wallDepth + sandAdjacentFlat;

export const visualCssConstant = {
	/** Size of the base underneath */
	platformBaseSize,
	platformOffsetSize,
	/** Length, like what you would walk down the beach. */
	platformWidthBeachLength,
	/** The side from wall to water. The cross-section. */
	platformHeightTotal,
	/** The side from wall to water. The cross-section. */
	platformHeightWallToMinTide,
	roadHeight,
	/** Depth of the road section. */
	roadDepth,
	/** The height of just the sand. Used for matching up the diorama height of beach access to the real height. */
	sandHeight,
	/** The sand area if it were totally flat. Used for calculating hypotenuse. */
	sandAdjacentFlat,
	/** The length needed for the sand at its slope to go from high to low. */
	sandHypotenuse,
	/** The angle of decline for the sand. */
	sandAngleDeg,
	/** Buffer for animating wet sand and the foam */
	sandFoamBuffer,
	/** Height of the wall */
	wallHeight,
	/** Depth of the wall */
	wallDepth,
	/** Animation height in diagram units */
	waterAnimationHeight
} as const;


export interface VisualCssDimensions {
	/** The "width of the water surface" that is visible at the top of the diorama. Y axis from the bottom. */
	waterSurfaceLength: number;
	/** Height of the water translated from feet. Z axis. */
	waterHeight: number;
	/** Distance along the hypotenuse that is available beach space. */
	beachDistanceToWater: number;
	/** Distance along the hypotenuse that is available beach space when the animation is at peak. */
	beachDistanceToWaterWithAnimation: number;
};

export function useVisualCssDimensions(waterLevelHeight: number): VisualCssDimensions {
	return React.useMemo<VisualCssDimensions>(() => {
		const { sandHeight, sandAngleDeg, sandAdjacentFlat, waterAnimationHeight } = visualCssConstant;

		/*
			Top of sand
			*
			*       *    beach distance to water
			*       *       *
			*       *       *       *       |                         water surface length          |
			*       *       *       *       *********************************************************-
			*       *       *       *       *       *
			*       *       *       *       *       *       *
			*       *       *       *       *       *       *       *                                 Water height
			*       *       *       *       *       *       *       *       *
			*       *       *       *       *       *       *       *       *       *
			*       *       *       *       *       *       *       *       Sand angle deg  *
			*       *       *       *       *       *       *       *       *       *       *       *-
										sand adjacent flat
		*/

		// Clamp the height so our animations never get too crazy.
		// diagramSandHeight / constant height = X / water level height
		const clampedHeight = Math.min(12, Math.max(0.5, waterLevelHeight));
		// Convert the height to our units.
		const waterHeight = sandHeight * (clampedHeight / constant.beachAccess.bestGuessBeachHeight);

		// Get the angle of the triangle opposite of the downward sand slope.
		const complementaryAngle = 90 - sandAngleDeg;
		// Get the width of the triangle, matching the total width of the top of the water.
		const waterSurfaceLength = Math.tan(complementaryAngle / 180 * Math.PI) * waterHeight;

		const beachDistanceToWater = Math.max(0, Math.sqrt(Math.pow(sandAdjacentFlat - waterSurfaceLength, 2) + Math.pow(sandHeight - waterHeight, 2)));

		const waterSurfaceLengthWithAnimation = waterHeight > sandHeight ? 0 : Math.tan(complementaryAngle / 180 * Math.PI) * (waterHeight + waterAnimationHeight);
		const beachDistanceToWaterWithAnimation = waterHeight + waterAnimationHeight > sandHeight ? 0 : Math.max(0, Math.sqrt(Math.pow(sandAdjacentFlat - waterSurfaceLengthWithAnimation, 2) + Math.pow(sandHeight - (waterHeight + waterAnimationHeight), 2)));

		return {
			waterSurfaceLength,
			waterHeight,
			beachDistanceToWater,
			beachDistanceToWaterWithAnimation
		};
	}, [waterLevelHeight]);
}