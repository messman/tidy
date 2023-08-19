import * as React from 'react';
import styled from 'styled-components';
import { Icon } from '@/index/core/icon/icon';
import { AttrsComponent } from '@/index/core/primitive/primitive-styled';
import { themeTokens } from '@/index/core/theme/theme-root';
import { icons } from '@wbtdevlocal/assets';
import { constant } from '@wbtdevlocal/iso';

/*
	Creates a 3D isometric diorama illustration of the beach.
*/

/** Width of the non-3d element that holds the diagram. */
const containerWidth = "30rem"; // 6rem
/** height of the non-3d element that holds the diagram. */
const containerHeight = "30rem"; // 5.25rem
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

/** Absolutely-positioned icon in the top corner. */
const BeachDiagram_StatusIcon = styled(Icon) <{ $isGood: boolean; }>`
	position: absolute;
	top: 0;
	right: 0;
	margin: .5rem;
	width: 1.5rem;
	height: 1.5rem;
	color: ${p => p.$isGood ? themeTokens.inform.positive : themeTokens.inform.unsure};
`;

/** The "front side", meaning the side that viewers see most that lends to the 3d effect. */
const objectFrontSideWidth = 150;
/** Depth, as in, the length of the beach-only side and length of the water-only side. */
const objectDepth = 100;
/** The height of just the sand. Used for matching up the diorama height of beach access to the real height. */
const objectSandHeight = 15;
/** The length needed for the sand at its slope to go from high to low. */
const sandHypotenuse = Math.sqrt(Math.pow(objectSandHeight, 2) + Math.pow(objectFrontSideWidth, 2));
/** The angle of decline for the sand. */
const sandAngleDeg = Math.atan(objectSandHeight / objectFrontSideWidth) * 180 / Math.PI;

/** The invisible "ground" upon which our animation sits. Is transformed so that it stays in the center of the parent. */
const BeachDiagram_Platform = styled.div`
	width: ${objectFrontSideWidth}px;
	height: ${objectDepth}px;
	position: relative;
	transform-origin: 50% 50%;
	transform:  rotateX(70deg) rotateZ(35deg) scale(${scale}) scaleZ(${scale}) translateZ(-${objectSandHeight / 2}px);
	transform-style: preserve-3d;
	//outline: 1px solid orange; // REMOVE
`;

/* //////////////////////////////////////////////////////////////////////////////////////// */

/** The triangle side of the sand for the "front side". We do not render a back side. */
const BeachDiagram_SandSideTriangle = styled.div`
	position: absolute;
	bottom: 0;
	left: 0;

	width: 0;
	height: 0;
	// For creating triangles: https://www.cssportal.com/css-triangle-generator/
	border-style: solid;
	border-width: ${objectSandHeight}px 0 0 ${objectFrontSideWidth}px;
	border-color: transparent transparent transparent ${themeTokens.beachDiagram.sandDarker};

	transform-origin: 0 100%;
	transform: rotateX(-90deg); // Stand it up by its feet
`;

/* //////////////////////////////////////////////////////////////////////////////////////// */

type BeachDiagram_SandPrintProps = {
	$print: Print;
};

/** A footprint in the sand. */
const BeachDiagram_SandPrint = styled.div.attrs((props: BeachDiagram_SandPrintProps) => {
	const { x, y, angle, isLeft } = props.$print;
	const style: Partial<CSSStyleDeclaration> = {
		left: `${x}px`,
		top: `${y}px`,
		transform: `rotateZ(${angle}deg) translateX(${(isLeft ? 1 : -1) * 2}px)`
	};

	return {
		style
	};
})`
	position: absolute;
	width: 2px;
	height: 3.5px;
	border-radius: 4px;
	background-color: ${themeTokens.beachDiagram.sandDarker};
	transform-origin: 50% 50%;
` as AttrsComponent<'div', BeachDiagram_SandPrintProps>;

type Print = {
	x: number;
	y: number;
	angle: number;
	isLeft: boolean;
};

let isLeft = false;
let angle = 60;
let x = 5;
let y = 95;
const travel = 6;
let travelAngle = 0;
const prints: Print[] = [{ x, y, angle, isLeft }];
function setTravelAngle(angle: number): void {
	travelAngle = angle;
}
function step() {
	isLeft = !isLeft;
	angle += travelAngle;
	x += Math.sin(angle / 180 * Math.PI) * travel;
	y += -Math.cos(angle / 180 * Math.PI) * travel;

	prints.push({
		x,
		y,
		angle,
		isLeft
	});
}

(() => {
	setTravelAngle(-10);
	step();
	step();
	step();
	step();
	step();
	step();
	step();
	setTravelAngle(-5);
	step();
	step();
	step();
	step();
	setTravelAngle(12);
	step();
	step();
	step();
	step();
	setTravelAngle(0);
	step();
	step();

	console.log(prints);
})();

/* //////////////////////////////////////////////////////////////////////////////////////// */

/** The top of the sand, which tilts down into the water. */
const BeachDiagram_Sand = styled.div`
	position: absolute;
	top: 0;
	right: 0;
	width: ${sandHypotenuse}px;
	height: ${objectDepth}px;
	background-color: ${themeTokens.beachDiagram.sand};

	transform-origin: 100% 0;
	transform: rotateY(${sandAngleDeg}deg); // Tilt it up from its right side
	transform-style: preserve-3d;
`;

/* //////////////////////////////////////////////////////////////////////////////////////// */

type WaterSideCompute = {
	/** The "width of the water surface" that is visible at the top of the diorama. */
	width: number;
	/** The height of the water that is used for the "triangle" up against the sand. This is clamped to not be taller than the sand itself. */
	heightTriangle: number;
	/** If the water level is higher than the sand, we should render additional rectangles atop our water triangles to continue the effect. */
	heightOverflow: number;
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
	style.width = `${($side === Side.front || $side === Side.back) ? $compute.width : objectDepth}px`;

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
	width: ${objectFrontSideWidth}px;
	height: ${objectDepth}px;
	background-color: ${themeTokens.beachDiagram.ocean};

	transform-origin: 0 0;
` as AttrsComponent<'div', BeachDiagram_WaterTopProps>;

/* //////////////////////////////////////////////////////////////////////////////////////// */

type BeachDiagram_WaveFoamContainerProps = {
	$compute: WaterSideCompute;
};

/** The top of the water, what the viewer really sees */
const BeachDiagram_WaveFoamContainer = styled.div.attrs((props: BeachDiagram_WaveFoamContainerProps) => {
	const { $compute } = props;

	const style: Partial<CSSStyleDeclaration> = {
		right: `${$compute.width}px`,
		transform: `translateZ(${$compute.heightTriangle}px)`
	};
	return {
		style
	};
})`
	position: absolute;
	top: 0;
	width: 0px;
	height: ${objectDepth}px;
	margin: 0;
	padding: 0;
	//outline: 1px solid red;

	transform-style: preserve-3d;
	transform-origin: 50% 50%;
` as AttrsComponent<'div', BeachDiagram_WaveFoamContainerProps>;

type BeachDiagram_WaveFoamProps = {
	$top: number;
	$compute: WaterSideCompute;
};

const foamSize = 4;

/** The top of the water, what the viewer really sees */
const BeachDiagram_WaveFoam = styled.div.attrs((props: BeachDiagram_WaveFoamProps) => {
	const { $top, $compute } = props;

	const style: Partial<CSSStyleDeclaration> = {
		top: `${$top - 2}px`,
		//right: `${$compute.width}px`,
		//transform: `translateZ(-${foamSize * .25}px)`
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

	transform: rotateX(-90deg) rotateY(20deg);
	transform-style: preserve-3d;
	transform-origin: 50% 100%;
` as AttrsComponent<'div', BeachDiagram_WaveFoamProps>;

const foamCount = 30;
const foamPaddingShift = 2;
const foams = Array(foamCount).fill(0).map((_value, i) => {
	return i * ((objectDepth - foamPaddingShift) / (foamCount - 1));
});


/* //////////////////////////////////////////////////////////////////////////////////////// */

type BeachDiagramProps = {
	height: number;
	isGood: boolean;
};

export const BeachDiagram: React.FC<BeachDiagramProps> = (props) => {
	const { height, isGood } = props;

	const compute = React.useMemo<WaterSideCompute>(() => {
		// Clamp the height so our animations never get too crazy.
		// diagramSandHeight / constant height = X / water level height
		const clampedHeight = Math.min(12, Math.max(0.5, height));
		// Get the total height the water should be.
		const waterSideHeight = (objectSandHeight * clampedHeight) / constant.beachAccess.beachTopHeight;
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

	const waveFoamRender = compute.heightOverflow > 0 ? null : foams.map((top) => {
		return (
			<BeachDiagram_WaveFoam key={top} $top={top} $compute={compute} />
		);
	});


	return (
		<BeachDiagram_Container>
			<BeachDiagram_Platform>
				<BeachDiagram_SandSideTriangle />
				<BeachDiagram_Sand>
					{prints.map((print) => {
						return (
							<BeachDiagram_SandPrint key={`x${print.x}-y${print.y}`} $print={print} />
						);
					})}
				</BeachDiagram_Sand>
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
				<BeachDiagram_WaveFoamContainer $compute={compute}>
					{waveFoamRender}
				</BeachDiagram_WaveFoamContainer>
			</BeachDiagram_Platform >
			<BeachDiagram_StatusIcon $isGood={isGood} type={isGood ? icons.statusSuccessOutline : icons.statusAlertOutline} />
		</BeachDiagram_Container>
	);
};




// const displayMinimum = 0;
// const displayMaximum = 10;

// function getWaterPath(height: number): string {
// 	/*
// 		Water path looks like

// 		.......          ........
// 		.    .            .     .
// 		.   .              .    .
// 		.    .            .     .
// 		.      ...........      .
// 		.                       .
// 		.........................

// 		Where we have basically a rectangle but with a bezier curve to make the cut-out for the sand.
// 	*/
// 	const clamped = Math.max(displayMinimum, Math.min(displayMaximum, height));
// 	const topY = (1 - (clamped / displayMaximum)) * 100;


// 	// Start from top-left, go clockwise, remember y=0 is the top
// 	return `M0, ${ topY; } C${ control1X; },${ control1Y; } ${ control1X; },${ control1Y; } V100 H0 V${ topY; } Z`;
// }

// const BeachDiagram_Container = styled.div`;
// 	position: relative;
// 	width: 6rem;
// 	height: 5.25rem;
// 	background-color: ${themeTokens.background.tint.lightest};
// 	overflow: hidden;
// 	border-radius: ${borderRadiusSmallerValue};
// `;



// const BeachDiagram_UmbrellaIcon = styled(Icon)`
// 	position: absolute;
// 	top: 1rem;
// 	left: .5rem;
// 	width: 2.625rem;
// 	height: 2.625rem;
// `;

// /*
// 	Useful SVG resources:
// 	- https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths
// 	- https://svg-path-visualizer.netlify.app/#M0%2C4%20Q2.5%2C2.5%206%2C4
// */

// type SVGProps = {
// 	viewBox: string;
// 	children: React.ReactNode;
// };

// const SVG_Unstyled: StyledFC<SVGProps> = (props) => {
// 	const { className, viewBox, children } = props;

// 	return (
// 		<svg className={className} xmlns='http://www.w3.org/2000/svg' viewBox={viewBox} preserveAspectRatio="none">
// 			{children}
// 		</svg>
// 	);
// };

// const SVGSand_Container = styled(SVG_Unstyled)`
// 	position: absolute;
// 	bottom: 0;
// 	left: 0;
// 	width: 100%;
// 	height: 2.3rem;
// `;

// const SVGSand_Path = styled.path`
// 	fill: ${themeTokens.beachDiagram.sand};
// `;

// const SVGWater_Container = styled(SVG_Unstyled)`
// 	position: absolute;
// 	bottom: 0;
// 	left: 0;
// 	width: 100%;
// 	height: 2.8rem;
// `;

// const SVGWater_Path = styled.path`
// 	fill: ${themeTokens.beachDiagram.ocean};
// `;

// type BeachDiagramProps = {
// 	height: number;
// 	isGood: boolean;
// };

// /** */
// export const BeachDiagram: React.FC<BeachDiagramProps> = (props) => {
// 	const { height, isGood } = props;

// 	const waterPath = React.useMemo(() => {
// 		return getWaterPath(height)
// 	}, [height]);

// 	return (
// 		<BeachDiagram_Container>
// 			<SVGSand_Container viewBox="0 0 100 100">
// 				<SVGSand_Path d="M-1,15 Q50,0 101,35 V100 H-1 V15 Z" />
// 			</SVGSand_Container>
// 			<BeachDiagram_UmbrellaIcon type={icons.brandUmbrella} />
// 			<SVGWater_Container viewBox="0 0 100 100">
// 				<SVGWater_Path d={waterPath} />
// 			</SVGWater_Container>
// 			<BeachDiagram_StatusIcon $isGood={isGood} type={isGood ? icons.statusSuccessOutline : icons.statusAlertOutline} />
// 		</BeachDiagram_Container >
// 	);
// };
