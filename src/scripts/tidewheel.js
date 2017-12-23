/*
	High / Low tides are calculated based on measurement data.

	Sample data output should be:
	Low		3:31AM	.7ft
	High	9:51AM	9.5ft
	Low		4:08PM	0ft
	High	10:23PM	8.5ft
*/

// The canvas we will draw to.
let canvas = null;
let canvasWidth = 0;
let canvasHeight = 0;
const devicePixelRatio = window.devicePixelRatio || 1;

function resize() {
	const ctx = canvas.getContext("2d");
	const backingStoreRatio = ctx.webkitBackingStorePixelRatio ||
		ctx.mozBackingStorePixelRatio ||
		ctx.msBackingStorePixelRatio ||
		ctx.oBackingStorePixelRatio ||
		ctx.backingStorePixelRatio || 1;
	const ratio = devicePixelRatio / backingStoreRatio;

	canvas.style.width = "100%";
	canvas.style.height = "100%";
	const rect = canvas.getBoundingClientRect();
	canvasWidth = Math.floor(rect.width);
	canvasHeight = Math.floor(rect.height);
	canvas.width = canvasWidth * ratio;
	canvas.height = canvasHeight * ratio;

	ctx.scale(ratio, ratio);

	redraw();
};
window.onresize = resize;

export function setup() {
	canvas = document.getElementById("tides-canvas");
	resize();
}

export function update(now, data) {
	const p = data["water_level_prediction"].predictions;
	if (!p || !p.length)
		return;

	let isRising = false;
	let prev = null;
	const points = [];
	p.forEach(function (curr, i) {
		if (i === 0) {
			prev = curr;
			return;
		}
		const diff = curr.v - prev.v;
		let add = false;
		if (isRising && diff > 0) {
			isRising = false;
			add = true;
		}
		else if (!isRising && diff < 0) {
			isRising = true;
			add = true;
		}
		if (add) {
			points.push({
				time: curr.t,
				val: parseFloat(curr.v),
				index: i
			});
		}
		prev = curr;
	});

	const nowDate = new Date(now);
	const currentLevel = parseFloat(data["water_level"].data[0].v);

	points.forEach(function (point) {
		const pointDate = new Date(point.time);
		const diff = (pointDate - nowDate);

		console.log(diff, point.val, currentLevel);
	});

	redraw();
}

function redraw() {
	const ctx = canvas.getContext("2d");

	// So we don't get cut off due to rounding
	const padding = 10;
	const totalWidth = canvasWidth - (padding * 2);
	const totalHeight = canvasHeight - (padding * 2);
	let bounds = { x: padding, y: padding, size: 0 };
	const diff = (totalWidth - totalHeight) / 2;
	if (diff > 0) {
		// Longer than tall
		bounds.size = totalHeight;
		bounds.x += diff;
	}
	else if (diff < 0) {
		// Taller than long
		bounds.size = totalWidth;
		bounds.y += -diff;
	}

	console.log(bounds);
	ctx.strokeRect(bounds.x, bounds.y, bounds.size, bounds.size);
}