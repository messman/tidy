import * as React from 'react';
import styled from 'styled-components';
import { AttrsComponent } from '@/index/core/primitive/primitive-styled';
import { themeTokens } from '@/index/core/theme/theme-root';
import { visualCssConstant, WaterSideCompute } from './visual-css-shared';

export interface VisualCssWaterProps {
	compute: WaterSideCompute;
};

export const VisualCssWater: React.FC<VisualCssWaterProps> = (props) => {
	const { compute } = props;

	return (
		<>
			<BeachDiagram_WaterSideTriangle $isCloserSide={false} $compute={compute} />
			<BeachDiagram_WaterSideTriangle $isCloserSide={true} $compute={compute} />
			<BeachDiagram_WaterSideRectangle $side={Side.water} $compute={compute} />
			{compute.heightOverflow && (
				<>
					<BeachDiagram_WaterSideRectangle $side={Side.sand} $compute={compute} />
					<BeachDiagram_WaterSideRectangle $side={Side.front} $compute={compute} />
					<BeachDiagram_WaterSideRectangle $side={Side.back} $compute={compute} />
				</>
			)}
			<BeachDiagram_WaterTop $compute={compute} />
		</>
	);
};

type BeachDiagram_WaterSideTriangleProps = {
	$isCloserSide: boolean;
	$compute: WaterSideCompute;
};

const BeachDiagram_WaterSideTriangle = styled.div.attrs((props: BeachDiagram_WaterSideTriangleProps) => {
	const { $compute, $isCloserSide } = props;

	const style: Partial<CSSStyleDeclaration> = {
		borderRightWidth: `${$compute.width}px`,
		borderBottomWidth: `${$compute.heightTriangle}px`
	};
	if (!$isCloserSide) {
		// Offset so that when "standing up by its feet", we will be at 0.
		style.top = `-${$compute.heightTriangle}px`;
	}
	else {
		style.borderRightColor = themeTokens.beachDiagram.oceanSide;
	}
	return {
		style
	};
})`
	position: absolute;
	right: 0;
	bottom: ${p => p.$isCloserSide ? 0 : 'unset'};

	backface-visibility: hidden;

	width: 0;
	height: 0;
	border-style: solid;
	border-width: 0;
	border-color: transparent ${themeTokens.beachDiagram.ocean} transparent transparent;

	transform-origin: 0 100%;
	transform: rotateX(-90deg); // Flip up by its feet
` as AttrsComponent<'div', BeachDiagram_WaterSideTriangleProps>;

/* //////////////////////////////////////////////////////////////////////////////////////// */

enum Side {
	sand,
	back,
	front,
	water
}

type BeachDiagram_WaterSideRectangleProps = {
	$side: Side;
	$compute: WaterSideCompute;
};

const BeachDiagram_WaterSideRectangle = styled.div.attrs((props: BeachDiagram_WaterSideRectangleProps) => {
	const { $compute, $side } = props;

	const style: Partial<CSSStyleDeclaration> = {};

	const combined = $compute.heightOverflow + $compute.heightTriangle;
	// The water side has no triangle and can just be the overall height.
	style.height = `${$side === Side.water ? (combined) : $compute.heightOverflow}px`;
	style.width = `${($side === Side.front || $side === Side.back) ? $compute.width : visualCssConstant.objectDepth}px`;

	if ($side === Side.front) {
		style.left = "0";
		style.bottom = "0";
		style.transformOrigin = "0 100%";
		style.transform = `translateZ(${$compute.heightTriangle}px) rotateX(-90deg)`; // Flip up by its feet
		style.backgroundColor = themeTokens.beachDiagram.oceanSide;
	}
	else if ($side === Side.back) {
		style.left = "0";
		style.top = `-${$compute.heightOverflow}px`; // Offset for flipping up so it will be at 0
		style.transformOrigin = "0 100%";
		style.transform = `translateZ(${$compute.heightTriangle}px) rotateX(-90deg)`; // Flip up by its feet
	}
	else if ($side === Side.sand) {
		style.left = "0";
		style.top = `-${$compute.heightOverflow}px`; // Same offset as above
		style.transformOrigin = "0 100%";
		style.transform = `translateZ(${$compute.heightTriangle}px) rotateX(-90deg) rotateY(-90deg)`;
	}
	else if ($side === Side.water) {
		style.right = "0";
		style.top = `-${combined}px`;
		style.transformOrigin = "100% 100%";
		style.transform = "rotateX(-90deg) rotateY(90deg)";
		style.backgroundColor = themeTokens.beachDiagram.oceanSide;
	}
	return {
		style
	};
})`
	position: absolute;
	background-color: ${themeTokens.beachDiagram.ocean};

	backface-visibility: hidden;
` as AttrsComponent<'div', BeachDiagram_WaterSideRectangleProps>;

/* //////////////////////////////////////////////////////////////////////////////////////// */

type BeachDiagram_WaterTopProps = {
	$compute: WaterSideCompute;
};

/** The top of the water, what the viewer really sees */
const BeachDiagram_WaterTop = styled.div.attrs((props: BeachDiagram_WaterTopProps) => {
	const { $compute } = props;

	const style: Partial<CSSStyleDeclaration> = {
		transform: `translateZ(${$compute.heightTriangle + $compute.heightOverflow}px)`
	};
	return {
		style
	};
})`
	position: absolute;
	top: 0;
	left: 0;
	// Right now we render the whole thing and have it cut into the sand, for ease of animation
	width: ${visualCssConstant.objectFrontSideWidth}px;
	height: ${visualCssConstant.objectDepth}px;
	background-color: ${themeTokens.beachDiagram.ocean};

	backface-visibility: hidden;

	transform-origin: 0 0;
` as AttrsComponent<'div', BeachDiagram_WaterTopProps>;