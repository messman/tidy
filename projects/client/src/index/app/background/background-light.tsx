import * as React from 'react';
import * as seedrandom from 'seedrandom';
import { Canvas, CanvasRender, RenderInput } from './canvas';

const DEBUG = true;

interface LightProps {
	isActive: boolean;
}

export const BackgroundLight: React.FC<LightProps> = (props) => {
	const { isActive } = props;

	const [render] = React.useState(() => {
		return createLightRender();
	});

	return (
		<Canvas render={isActive ? render : null} name="light" />
	);
};

interface Beam {
	x: number;
	widthFactor: number;
	flashOnFactor: number;
	flashOffFactor: number;
	flashCycleStartFactor: number;
	flashCycleAt: number;
}

const beamWidthRange = [70, 200] as const;
const beamFrequency = .015;
const lightsAngleChangeWidth = 1600;
const lightsAngleRange = [5, 40] as const;
const beamFlashOnRange = [500, 700] as const;
const beamFlashOffRange = [1500, 4500] as const;
const flashTransitionDuration = 400;
const randomX = seedrandom("beamsWidth");
const randomY = seedrandom("beamsHeight");

function createLightRender(): CanvasRender {

	let startTime: number | null = null;
	let canvasWidth = 0;
	let canvasHeight = 0;

	let beamsCreatedForWidth = 0;
	let beamsCreatedForHeight = 0;
	let beams: Beam[] = [];
	function createBeams() {

		function createBeam(x: number, random: () => number): Beam {
			return {
				x,
				widthFactor: random(),
				flashOnFactor: random(),
				flashOffFactor: random(),
				flashCycleStartFactor: random(),
				flashCycleAt: 0
			};
		}

		// Handle changes in width
		for (let i = beamsCreatedForWidth; i < canvasWidth; i++) {
			const hasBeam = randomX() < beamFrequency;
			if (hasBeam) {
				beams.push(createBeam(i, randomX));
			}
		}
		beamsCreatedForWidth = canvasWidth;

		// Handle changes in height
		if (beamsCreatedForHeight !== canvasHeight) {
			const [angle] = lightsAngleRange;
			const radians = (angle * (Math.PI * 2)) / 360;
			const tan = Math.tan(radians);
			function trigOpposite(adjacent: number): number {
				return Math.round(tan * adjacent);
			}
			const beamsCreatedForHeightAsX = trigOpposite(beamsCreatedForHeight);
			const canvasHeightAsX = trigOpposite(canvasHeight);

			for (let i = beamsCreatedForHeightAsX; i < canvasHeightAsX; i++) {
				const hasBeam = randomY() < beamFrequency;
				if (hasBeam) {
					beams.push(createBeam(-i, randomY));
				}
			}
			//console.log({ beamsCreatedForHeight, canvasHeight, beamsCreatedForHeightAsX, canvasHeightAsX });
			beamsCreatedForHeight = canvasHeight;
		}
	}

	function findBottomXFromAngle(startTopX: number): number {
		const anglePercent = Math.min(1, Math.max(0, startTopX) / lightsAngleChangeWidth);
		const angle = pickFrom(lightsAngleRange, anglePercent);
		const radians = (angle * (Math.PI * 2)) / 360;
		const opposite = Math.tan(radians) * canvasHeight;
		return startTopX + opposite;
	}

	function computeAndDrawBeam(now: number, ctx: CanvasRenderingContext2D, beam: Beam, _index: number): void {
		const { x, widthFactor, flashOnFactor, flashOffFactor, flashCycleStartFactor } = beam;

		const topLeftX = x;
		const topWidth = pickFrom(beamWidthRange, widthFactor);
		const topRightX = topLeftX + topWidth;

		const bottomLeftX = findBottomXFromAngle(topLeftX);
		const bottomRightX = findBottomXFromAngle(topRightX);

		const flashOn = pickFrom(beamFlashOnRange, flashOnFactor);
		const flashOff = pickFrom(beamFlashOffRange, flashOffFactor);
		const totalFlashCycleTime = flashOn + flashOff + (flashTransitionDuration * 2);

		let { flashCycleAt } = beam;
		if (flashCycleAt === 0 || ((now - flashCycleAt) > (totalFlashCycleTime * 2))) {
			// First time or it's been awhile; set up animation
			const offset = Math.round(flashCycleStartFactor * totalFlashCycleTime);
			flashCycleAt = now - offset;
		}
		// This modulo doesn't really need to be here given the code above, but it's good to have just in case.
		const flashTimeInLoop = (now - flashCycleAt) % totalFlashCycleTime;
		// This is redundant but again, do it just in case of any weird time issues
		beam.flashCycleAt = now - flashTimeInLoop;

		/*
			Phases: on -> transition off -> off -> transition on
		*/
		let globalAlpha = 1;

		if (flashTimeInLoop < flashOn) {
			// Do nothing
		}
		else if (flashTimeInLoop < (flashOn + flashTransitionDuration)) {
			const timeInTransition = flashTimeInLoop - flashOn;
			globalAlpha = (1 - (timeInTransition / flashTransitionDuration)) * globalAlpha;
		}
		else if (flashTimeInLoop < (flashOn + flashTransitionDuration + flashOff)) {
			globalAlpha = 0;
		}
		else {
			const timeInTransition = flashTimeInLoop - flashOn - flashOff - flashTransitionDuration;
			globalAlpha = (timeInTransition / flashTransitionDuration) * globalAlpha;
		}

		const topMidpointX = Math.round((topLeftX + topRightX) / 2);
		const bottomMidpointX = Math.round((bottomLeftX + bottomRightX) / 2);
		const gradient = ctx.createLinearGradient(topMidpointX, 0, bottomMidpointX, canvasHeight);
		gradient.addColorStop(0, "rgba(255, 244, 147, 0.06)");
		gradient.addColorStop(1, "rgba(255, 244, 147, 0.015)");

		ctx.save();
		ctx.moveTo(topLeftX, 0);
		ctx.beginPath();
		ctx.lineTo(topRightX, 0);
		ctx.lineTo(bottomRightX, canvasHeight);
		ctx.lineTo(bottomLeftX, canvasHeight);
		ctx.lineTo(topLeftX, 0);
		ctx.closePath();
		ctx.globalAlpha = globalAlpha;
		if (DEBUG) {
			ctx.globalAlpha = globalAlpha * .1;
			ctx.fillStyle = "red";
		}
		else {
			ctx.filter = "blur(15px)";
			ctx.fillStyle = gradient;
		}
		ctx.fill();
		ctx.restore();
	}

	return function render({ ctx, width: newCanvasWidth, height: newCanvasHeight }: RenderInput): void {
		if (!ctx) {
			startTime = null;
			return;
		}

		const now = Date.now();
		// Detect first run
		if (startTime === null) {
			startTime = now;
			createBeams();
		}

		// Detect changed size
		if (newCanvasWidth !== canvasWidth || newCanvasHeight !== canvasHeight) {
			canvasWidth = newCanvasWidth;
			canvasHeight = newCanvasHeight;
			createBeams();
		}

		// Clear the canvas.
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);

		// Draw!
		beams.forEach((beam, i) => {
			computeAndDrawBeam(now, ctx, beam, i);
		});
	};
};

function pickFrom([min, max]: readonly [number, number], percent: number): number {
	return (percent * (max - min)) + min;
}