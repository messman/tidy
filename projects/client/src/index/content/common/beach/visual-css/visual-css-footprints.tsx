import * as React from 'react';
import styled from 'styled-components';
import { themeTokens } from '@/index/core/theme/theme-root';

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
})();

export const VisualCssFootprints: React.FC = () => {
	return (
		<>
			{prints.map((print) => {

				const { x, y, angle, isLeft } = print;
				const style: Partial<React.CSSProperties> = {
					left: `${x}px`,
					top: `${y}px`,
					transform: `rotateZ(${angle}deg) translateX(${(isLeft ? 1 : -1) * 2}px)`
				};

				return (
					<VisualCssFootprint key={`x${print.x}-y${print.y}`} style={style} />
				);
			})}
		</>
	);
};

const VisualCssFootprint = styled.div`
	position: absolute;
	width: 2px;
	height: 3.5px;
	border-radius: 4px;
	background-color: ${themeTokens.beachDiagram.sandDarker};
	transform-origin: 50% 50%;
`;



