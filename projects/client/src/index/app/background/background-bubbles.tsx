import * as React from 'react';
import { Canvas, CanvasRender, RenderInput } from './canvas';

//const DEBUG = false;

/*
	Inspiration:
	- https://codepen.io/n_c_/pen/eYmyWON
	- https://codepen.io/tdoughty/pen/ZZqgQq
	- https://codepen.io/tamago_tofu/pen/eYpMGNK
*/

interface BubblesProps {
	isActive: boolean;
}

export const Bubbles: React.FC<BubblesProps> = (props) => {
	const { isActive } = props;

	const [render] = React.useState(() => {
		return createBubbleRender();
	});

	return (
		<Canvas render={isActive ? render : null} />
	);
};


const renderWidthMax = 900;
const renderPadding = 20;
const createGroupTimeRange = [800, 2300] as const;
const bubbleDiameterRange = [5, 12] as const;
const bubbleAmplitudeRange = [1, 5] as const;
const bubbleSpeedRange = [.27, .42] as const;
const bubbleJiggleSpeed = .015;
const bubbleOffsetY = 200;

const bubbleStyles = ["a", "b", "c", "d", "e"] as const;
type BubbleStyle = typeof bubbleStyles[number];

interface BubbleStyleBehavior {
	sizes: number[];
	color: string;
}

const styleBehaviors: Record<BubbleStyle, BubbleStyleBehavior> = {
	a: {
		sizes: [1, .5, .2],
		color: "green"
	},
	b: {
		sizes: [.6, .7],
		color: "red"
	},
	c: {
		sizes: [.8, .25, .5],
		color: "orange"
	},
	d: {
		sizes: [.65, .32, .28],
		color: "yellow"
	},
	e: {
		sizes: [.1, .22, .35],
		color: "pink"
	},
};

interface BubbleGroup {
	createdAt: number;
	startX: number;
	style: BubbleStyle;
}

function createBubbleRender(): CanvasRender {

	let startTime: number | null = null;
	let canvasWidth = 0;
	let canvasHeight = 0;

	let nextGroupTime: number = Infinity;
	let bubbleGroups: BubbleGroup[] = [];

	let usedStyles: BubbleStyle[] = [];
	let stylesQueue = shuffle(bubbleStyles as unknown as BubbleStyle[]);

	function pickNextStyle(): BubbleStyle {
		const next = stylesQueue.pop()!;
		if (!stylesQueue.length) {
			stylesQueue = shuffle(usedStyles);
			usedStyles = [next];
		}
		else {
			usedStyles.push(next);
		}
		return next;
	}

	function setNextGroupTime(now: number): void {
		nextGroupTime = now + Math.round(pickFrom(createGroupTimeRange, Math.random()));
	}

	function addBubbleGroup(now: number): void {
		const minX = Math.max(renderPadding, (Math.max(canvasWidth - renderWidthMax, 0) / 2));
		const maxX = canvasWidth - minX;
		const x = Math.round(pickFrom([minX, maxX], Math.random()));

		const style = pickNextStyle();
		console.log({ canvasWidth, minX, maxX, x });
		//console.log({ style });
		bubbleGroups.push({
			createdAt: now,
			startX: x,
			style
		});
	}

	function drawBubble(now: number, ctx: CanvasRenderingContext2D, group: BubbleGroup, size: number, index: number): boolean {
		const { createdAt, startX } = group;
		//const { color } = styleBehaviors[style];

		const speed = pickFrom(bubbleSpeedRange, 1 - size);
		const diameter = pickFrom(bubbleDiameterRange, size);
		const amplitude = pickFrom(bubbleAmplitudeRange, 1 - size);

		// Use the passage of time to mark distance traveled.
		const timePassed = now - createdAt;
		const distanceY = speed * timePassed;
		const offsetY = diameter * 2 * index;
		const y = canvasHeight + bubbleOffsetY - distanceY - offsetY;

		const offsetX = diameter * index * (Math.pow(-1, index));
		const jiggle = Math.sin(timePassed * bubbleJiggleSpeed + index) * amplitude;
		const x = startX + jiggle + offsetX;

		// If we have moved the width of the line, a new line can be drawn in this "row".
		if (y < 0) {
			return false;
		}

		// Otherwise, draw it.
		ctx.save();
		ctx.fillStyle = "#FFFFFF";
		ctx.beginPath();
		ctx.arc(x, y, diameter / 2, 0, Math.PI * 2);
		ctx.closePath();
		ctx.fill();
		ctx.restore();

		return true;
	}

	return function render({ ctx, width: newCanvasWidth, height: newCanvasHeight }: RenderInput): void {
		if (!ctx) {
			startTime = null;
			return;
		}

		const now = Date.now();
		if (startTime === null) {
			startTime = now;
			setNextGroupTime(now);
		}

		if (newCanvasWidth !== canvasWidth || newCanvasHeight !== canvasHeight) {
			canvasWidth = newCanvasWidth;
			canvasHeight = newCanvasHeight;

			// TODO: adjust data
		}

		if (now > nextGroupTime) {
			addBubbleGroup(now);
			setNextGroupTime(now);
		}

		// Clear the canvas.
		ctx.globalAlpha = .2;
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);

		// Draw each line, and rebuild the line dictionary at the same time.
		bubbleGroups = bubbleGroups.filter((group) => {
			const { style } = group;
			const { sizes } = styleBehaviors[style];

			const sizesLeftToDraw = sizes.filter((size, i) => {
				return drawBubble(now, ctx, group, size, i);
			});
			return sizesLeftToDraw.length > 0;
		});
	};
};

function shuffle<T>(input: T[]): T[] {
	return input
		.map(value => ({ value, sort: Math.random() }))
		.sort((a, b) => a.sort - b.sort)
		.map(({ value }) => value);
}

function pickFrom([min, max]: readonly [number, number], percent: number): number {
	return (percent * (max - min)) + min;
}