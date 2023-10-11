import styled from 'styled-components';
import { themeTokens } from '@/index/core/theme/theme-root';
import { visualCssConstant } from './visual-css-shared';

/** The triangle side of the sand for the "front side". We do not render a back side. */
export const VisualCssSandSideTriangle = styled.div`
	position: absolute;
	bottom: 0;
	left: 0;

	width: 0;
	height: 0;
	// For creating triangles: https://www.cssportal.com/css-triangle-generator/
	border-style: solid;
	border-width: ${visualCssConstant.objectSandHeight}px 0 0 ${visualCssConstant.objectFrontSideWidth}px;
	border-color: transparent transparent transparent ${themeTokens.beachDiagram.sandDarker};

	backface-visibility: hidden;

	transform-origin: 0 100%;
	transform: rotateX(-90deg); // Stand it up by its feet
`;

/** The top of the sand, which tilts down into the water. */
export const VisualCssSand = styled.div`
	position: absolute;
	top: 0;
	right: 0;
	width: ${visualCssConstant.sandHypotenuse}px;
	height: ${visualCssConstant.objectDepth}px;
	background-color: ${themeTokens.beachDiagram.sand};

	backface-visibility: hidden;

	transform-origin: 100% 0;
	transform: rotateY(${visualCssConstant.sandAngleDeg}deg); // Tilt it up from its right side
	transform-style: preserve-3d;
`;