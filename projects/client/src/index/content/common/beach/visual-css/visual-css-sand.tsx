import * as React from 'react';
import styled from 'styled-components';
import { themeTokens } from '@/index/core/theme/theme-root';
import { visualCssConstant, VisualCssDimensions } from './visual-css-shared';

const wetSandBuffer = 3;

export interface VisualCssSandProps {
	dimensions: VisualCssDimensions;
	children?: React.ReactNode;
};

export const VisualCssSand: React.FC<VisualCssSandProps> = (props) => {
	const { dimensions, children } = props;

	const { beachDistanceToWaterWithAnimation } = dimensions;

	const background = (() => {

		if (beachDistanceToWaterWithAnimation <= wetSandBuffer) {
			return themeTokens.beachDiagram.sandWet;
		}

		const percentChange = Math.round(((beachDistanceToWaterWithAnimation - wetSandBuffer) / visualCssConstant.sandHypotenuse) * 10000) / 100;

		return `linear-gradient(${themeTokens.beachDiagram.sand} 0%, ${themeTokens.beachDiagram.sand} ${percentChange}%, ${themeTokens.beachDiagram.sandWet} ${percentChange}%, ${themeTokens.beachDiagram.sandWet} 100%)`;
	})();


	return (
		<>
			<SandTriangle />
			<SandBeach style={{ background }}>
				{children}
			</SandBeach>
		</>
	);
};


/** The top of the sand, which tilts down into the water. */
const SandBeach = styled.div`
	position: absolute;
	bottom: 0;
	left: 0;
	width: ${visualCssConstant.platformWidthBeachLength}px;
	height: ${visualCssConstant.sandHypotenuse}px;

	backface-visibility: hidden;

	transform-origin: 0 100%;
	transform: rotateX(-${visualCssConstant.sandAngleDeg}deg); // Tilt it up from its bottom
	transform-style: preserve-3d;

	overflow: hidden;
`;


/** The triangle side of the sand for the "front side". We do not render a back side. */
const SandTriangle = styled.div`
	position: absolute;
	bottom: 0;
	left: 0;

	width: 0;
	height: 0;
	// For creating triangles: https://www.cssportal.com/css-triangle-generator/
	border-style: solid;
	border-width: ${visualCssConstant.sandHeight}px 0 0 ${visualCssConstant.sandAdjacentFlat}px;
	border-color: transparent transparent transparent ${themeTokens.beachDiagram.sandSide};

	backface-visibility: hidden;

	transform-origin: 0 100%;
	transform: rotateZ(90deg) rotateX(-90deg) translateX(-${visualCssConstant.sandAdjacentFlat}px);
`;
