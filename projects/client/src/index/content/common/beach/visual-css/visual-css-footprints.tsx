import * as React from 'react';
import styled from 'styled-components';
import { themeTokens } from '@/index/core/theme/theme-root';
import { visualCssConstant, VisualCssDimensions } from './visual-css-shared';

type Print = {
	x: number;
	y: number;
	angle: number;
	isLeft: boolean;
};



export interface VisualCssFootprintsProps {
	dimensions: VisualCssDimensions;
}

export const VisualCssFootprints: React.FC<VisualCssFootprintsProps> = (props) => {
	const { dimensions } = props;
	const { beachDistanceToWaterWithAnimation } = dimensions;

	const prints = React.useMemo<Print[]>(() => {
		if (beachDistanceToWaterWithAnimation < 20) {
			return [];
		}

		let minY = 5;
		let maxY = Math.round(beachDistanceToWaterWithAnimation) - 5;

		let y = (Math.random() * (maxY - minY)) + minY;
		let x = 1;

		let isLeft = false;
		let angle = 90;
		const travel = 5;
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

		let turnIndex = 0;
		let stepIndex = 0;
		while (x < visualCssConstant.platformWidthBeachLength - 5 && stepIndex < 200) {
			if (stepIndex === turnIndex) {
				// Range of (-.5, .5)
				//let travelAngleRaw = Math.round(((Math.random() * .5) - .25) * 100) / 100;

				const yPositionInRange = (y - minY) / (maxY - minY);
				// Range of [-.5, .5] (can technically be outside but we try to prevent that)
				const yPositionFromMiddle = yPositionInRange - .5;

				const yPositionEqualizer = yPositionFromMiddle * -1 * (Math.random() + 1);

				//const average = (travelAngleRaw + yPositionEqualizer) / 2;

				// // If closer to one side and turning towards it, flip the angle
				// if (yPositionInRange < .25) {
				// 	if (travelAngle < 0) {
				// 		travelAngle *= -1;
				// 	}
				// 	travelAngle *= 2;
				// }
				// if (yPositionInRange > .75) {
				// 	if (travelAngle > 0) {
				// 		travelAngle *= -1;
				// 	}
				// 	travelAngle *= 2;
				// }
				let travelAngle = yPositionEqualizer;
				travelAngle = Math.round(travelAngle * 100) / 100;

				setTravelAngle(travelAngle);
				// Inversely proportional to position!
				turnIndex = stepIndex + Math.round(((1 - Math.abs(yPositionFromMiddle)) * 15));
				//console.log({ stepIndex, yPositionInRange, yPositionEqualizer, travelAngle, turnIndex });
			}
			step();
			stepIndex++;
		}


		return prints;
	}, [beachDistanceToWaterWithAnimation]);

	return (
		<>
			{prints.map((print) => {

				const { x, y, angle, isLeft } = print;
				const style: Partial<React.CSSProperties> = {
					left: `${x}px`,
					top: `${y}px`,
					transform: `rotateZ(${angle}deg) translateX(${(isLeft ? 1 : -1) * 1.75}px)`
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
	width: 1.75px;
	aspect-ratio: .5;
	border-radius: 4px;
	background-color: ${themeTokens.beachDiagram.sandFootstep};
	transform-origin: 50% 50%;
`;



