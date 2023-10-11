import * as React from 'react';
import styled from 'styled-components';
import { VisualCssFoam } from './visual-css-foam';
import { VisualCssFootprints } from './visual-css-footprints';
import { VisualCssSand, VisualCssSandSideTriangle } from './visual-css-sand';
import { useWaterSideCompute, visualCssConstant } from './visual-css-shared';
import { VisualCssWater } from './visual-css-water';

// https://codepen.io/alchemist107/pen/LYGdzjL

/*
	Creates a 3D isometric diorama illustration of the beach.
*/

/** height of the non-3d element that holds the diagram. */
const containerHeight = "30rem";
/** Scaling of the 3d section. */
const scale = 5.5; // 1

/** Non-3d container */
const BeachDiagram_Container = styled.div`
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: ${containerHeight};
	outline: 2px solid red; // REMOVE
`;

/** The invisible "ground" upon which our animation sits. Is transformed so that it stays in the center of the parent. */
const BeachDiagram_Platform = styled.div`
	width: ${visualCssConstant.objectFrontSideWidth}px;
	height: ${visualCssConstant.objectDepth}px;
	position: relative;
	transform-origin: 50% 50%;
	transform:  rotateX(70deg) rotateZ(35deg) scale(${scale}) scaleZ(${scale}) translateZ(-${visualCssConstant.objectSandHeight / 2}px);
	transform-style: preserve-3d;
	outline: 1px solid orange; // REMOVE
`;

type VisualCssProps = {
	height: number;
};

export const VisualCss: React.FC<VisualCssProps> = (props) => {
	const { height } = props;

	const compute = useWaterSideCompute(height);

	return (
		<BeachDiagram_Container>
			<BeachDiagram_Platform>
				<VisualCssSandSideTriangle />
				<VisualCssSand>
					<VisualCssFootprints />
				</VisualCssSand>
				<VisualCssWater compute={compute} />
				<VisualCssFoam compute={compute} />
			</BeachDiagram_Platform >
		</BeachDiagram_Container>
	);
};