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
	canvasWidth = rect.width;
	canvasHeight = rect.height;
	canvas.width = canvasWidth * ratio;
	canvas.height = canvasHeight * ratio;

	ctx.scale(ratio, ratio);
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
	console.log(points);

	const nowDate = new Date(now);
	const currentLevel = parseFloat(data["water_level"].data[0].v);

	points.forEach(function (point) {
		const pointDate = new Date(point.time);
		const diff = (pointDate - nowDate);

		console.log(diff, point.val, currentLevel);
	});

	const ctx = canvas.getContext("2d");
	console.log(canvasWidth, canvasHeight);
	ctx.strokeRect(5, 5, canvasWidth - 10, canvasHeight - 10);
}