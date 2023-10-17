import * as React from 'react';
import styled, { keyframes } from 'styled-components';
import { visualCssConstant, VisualCssDimensions } from './visual-css-shared';

// const foamCount = 30;
// const foamPaddingShift = 2;

export interface VisualCssFoamProps {
	dimensions: VisualCssDimensions;
};

export const VisualCssFoam: React.FC<VisualCssFoamProps> = (props) => {
	const { dimensions } = props;
	const { beachDistanceToWater, beachDistanceToWaterWithAnimation } = dimensions;

	const { sandFoamBuffer } = visualCssConstant;

	const startY = beachDistanceToWaterWithAnimation - sandFoamBuffer;

	return (
		<FoamContainer
			style={{
				// Use visibility instead of block or null so that the animations stay synced
				visibility: startY < 0 ? 'hidden' : 'visible',
				transform: `translateY(${startY}px)`,
				height: `${beachDistanceToWater - beachDistanceToWaterWithAnimation + sandFoamBuffer}px`
			}}
		>
			<FoamContainerRelative>
				<Foam />
			</FoamContainerRelative>
		</FoamContainer>
	);
};

const FoamContainer = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	// height is set in style
	overflow: hidden;
`;

const FoamContainerRelative = styled.div`
	position: relative;
	width: 100%;
	height: 100%;
`;

const foamAnimation = keyframes`
	${'0%'} {
		// At bottom, coming up with wave
		bottom: 0;
		height: 0px;
		opacity: 0;
	}
	${'5%'} {
		opacity: 0;
		height: 0px;
	}
	${'50%'} {
		bottom: calc(100% - ${visualCssConstant.sandFoamBuffer}px);
		height: ${visualCssConstant.sandFoamBuffer}px;
		opacity: 1;
	}
	${'65%'} {
		opacity: 1;
	}
	${'100%'} {
		bottom: 0;
		height: 100%;
		opacity: 0;
	}
`;

const Foam = styled.div`
	position: absolute;
	left: 0;

	background-color: #FFF;

	width: 100%;

	animation-name: ${foamAnimation};
	animation-timing-function: ease-in-out;
	animation-duration: 6s;
	animation-direction: normal;
	animation-iteration-count: infinite;
`;


// export const VisualCssFoam: React.FC<VisualCssFoamProps> = (props) => {
// 	const { dimensions } = props;

// 	const foams = Array(foamCount).fill(0).map((_value, i) => {
// 		return i * ((visualCssConstant.objectDepth - foamPaddingShift) / (foamCount - 1));
// 	});

// 	const waveFoamRender = compute.waterHeight > compute.sandHeight ? null : foams.map((top) => {
// 		return (
// 			<VisualCssFoamPiece key={top} $top={top} $compute={compute} />
// 		);
// 	});

// 	return (
// 		<VisualCssFoamContainer $compute={compute}>
// 			{waveFoamRender}
// 		</VisualCssFoamContainer>
// 	);
// };


// type VisualCssFoamContainerProps = {
// 	$compute: VisualCssDimensions;
// };

// /** The top of the water, what the viewer really sees */
// const VisualCssFoamContainer = styled.div.attrs((props: VisualCssFoamContainerProps) => {
// 	const { $compute } = props;

// 	const style: Partial<CSSStyleDeclaration> = {
// 		right: `${$compute.waterSurfaceLength}px`,
// 		transform: `translateZ(${$compute.heightTriangle}px)`
// 	};
// 	return {
// 		style
// 	};
// })`
// 	position: absolute;
// 	top: 0;
// 	width: 0px;
// 	height: ${visualCssConstant.objectDepth}px;
// 	margin: 0;
// 	padding: 0;
// 	outline: 1px solid red;

// 	backface-visibility: hidden;

// 	transform-style: preserve-3d;
// 	transform-origin: 50% 50%;
// ` as AttrsComponent<'div', VisualCssFoamContainerProps>;

// type VisualCssFoamPieceProps = {
// 	$top: number;
// 	$compute: VisualCssDimensions;
// };

// const foamSize = 4;

// /** The top of the water, what the viewer really sees */
// const VisualCssFoamPiece = styled.div.attrs((props: VisualCssFoamPieceProps) => {
// 	const { $top, $compute } = props;

// 	const style: Partial<CSSStyleDeclaration> = {
// 		top: `${$top - 2}px`,
// 		right: `${$compute.waterSurfaceLength}px`,
// 		transform: `translateZ(-${foamSize * .25}px)`
// 	};
// 	return {
// 		style
// 	};
// })`
// 	position: absolute;
// 	left: -${foamSize / 2}px;
// 	width: ${foamSize}px;
// 	height: ${foamSize}px;
// 	border-radius: 100%;
// 	background-color: white;

// 	backface-visibility: hidden;

// 	transform: rotateX(-90deg) rotateY(20deg);
// 	transform-style: preserve-3d;
// 	transform-origin: 50% 100%;
// ` as AttrsComponent<'div', VisualCssFoamPieceProps>;