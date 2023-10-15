import * as React from 'react';
import styled from 'styled-components';
import { AttrsComponent } from '@/index/core/primitive/primitive-styled';
import { visualCssConstant, VisualCssDimensions } from './visual-css-shared';

const foamCount = 30;
const foamPaddingShift = 2;

export interface VisualCssFoamProps {
	compute: VisualCssDimensions;
};

export const VisualCssFoam: React.FC<VisualCssFoamProps> = (props) => {
	const { compute } = props;

	const foams = Array(foamCount).fill(0).map((_value, i) => {
		return i * ((visualCssConstant.objectDepth - foamPaddingShift) / (foamCount - 1));
	});

	const waveFoamRender = compute.waterHeight > compute.sandHeight ? null : foams.map((top) => {
		return (
			<VisualCssFoamPiece key={top} $top={top} $compute={compute} />
		);
	});

	return (
		<VisualCssFoamContainer $compute={compute}>
			{waveFoamRender}
		</VisualCssFoamContainer>
	);
};


type VisualCssFoamContainerProps = {
	$compute: VisualCssDimensions;
};

/** The top of the water, what the viewer really sees */
const VisualCssFoamContainer = styled.div.attrs((props: VisualCssFoamContainerProps) => {
	const { $compute } = props;

	const style: Partial<CSSStyleDeclaration> = {
		right: `${$compute.waterSurfaceLength}px`,
		transform: `translateZ(${$compute.heightTriangle}px)`
	};
	return {
		style
	};
})`
	position: absolute;
	top: 0;
	width: 0px;
	height: ${visualCssConstant.objectDepth}px;
	margin: 0;
	padding: 0;
	outline: 1px solid red;

	backface-visibility: hidden;

	transform-style: preserve-3d;
	transform-origin: 50% 50%;
` as AttrsComponent<'div', VisualCssFoamContainerProps>;

type VisualCssFoamPieceProps = {
	$top: number;
	$compute: VisualCssDimensions;
};

const foamSize = 4;

/** The top of the water, what the viewer really sees */
const VisualCssFoamPiece = styled.div.attrs((props: VisualCssFoamPieceProps) => {
	const { $top, $compute } = props;

	const style: Partial<CSSStyleDeclaration> = {
		top: `${$top - 2}px`,
		right: `${$compute.waterSurfaceLength}px`,
		transform: `translateZ(-${foamSize * .25}px)`
	};
	return {
		style
	};
})`
	position: absolute;
	left: -${foamSize / 2}px;
	width: ${foamSize}px;
	height: ${foamSize}px;
	border-radius: 100%;
	background-color: white;

	backface-visibility: hidden;

	transform: rotateX(-90deg) rotateY(20deg);
	transform-style: preserve-3d;
	transform-origin: 50% 100%;
` as AttrsComponent<'div', VisualCssFoamPieceProps>;