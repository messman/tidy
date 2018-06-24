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
	// Keep the canvas crisp for high-resolution displays.
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
	// Get the canvas and resize it.
	canvas = document.getElementById("tides-canvas");
	resize();
}

let drawNums = null;

function parseTime(timeString) {
	// Parse for Safari
	// year-month-date HH:mm
	timeString = timeString.trim();
	const parts = timeString.split(" ");
	const date = parts[0];
	const dateParts = date.split("-");
	const year = dateParts[0];
	const month = dateParts[1];
	const dateDay = dateParts[2];

	const time = parts[1];
	const timeParts = time.split(":");
	const hours = timeParts[0];
	const minutes = timeParts[1];

	const newDate = new Date();
	newDate.setFullYear(year, month - 1, dateDay);
	newDate.setHours(hours);
	newDate.setMinutes(minutes);
	newDate.setSeconds(0);
	newDate.setMilliseconds(0);

	return newDate;
}

export function update(now, data, DEBUG) {
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
				time: parseTime(curr.t),
				val: parseFloat(curr.v),
				index: i
			});
		}
		prev = curr;
	});

	if (DEBUG)
		console.log(points);

	const nowDate = new Date(now);
	const currentLevel = parseFloat(data["water_level"].data[0].v);

	let closestHigh = null;
	let closestLow = null;
	points.forEach(function (point) {
		if (point.val < currentLevel) {
			if (!closestLow || (Math.abs(nowDate - point.time) < Math.abs(now - closestLow.time)))
				closestLow = point;
		}
		else {
			if (!closestHigh || (Math.abs(nowDate - point.time) < Math.abs(now - closestHigh.time)))
				closestHigh = point;
		}
	});

	const diff = closestLow.time - closestHigh.time;
	isRising = diff < 0;
	let angle;
	if (isRising) {
		angle = (nowDate - closestLow.time) / Math.abs(diff) * Math.PI + Math.PI;
	}
	else {
		angle = (nowDate - closestHigh.time) / Math.abs(diff) * Math.PI;
	}

	drawNums = {
		now: nowDate,
		low: closestLow.time,
		high: closestHigh.time,
		isRising,
		angle
	};
	console.log(drawNums);

	redraw();
}

const colors = {
	darkBlue: "#11394D",
	mediumBlue: "#10597C",
	lightBlue: "#1CAAB8",
	paleBlue: "#A3CED4",
	light: "#DEE3E7",
	gray: "#979AAB"
};

const centerRadiusPercent = .3;
const dialThicknessPercent = .05;
const dialLengthPercent = .85;
const tidalAreaHeightPercent = .20;

function redraw() {
	if (!drawNums)
		return;

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

	ctx.rect(bounds.x, bounds.y, bounds.size, bounds.size);
	ctx.save();

	const radius = bounds.size / 2;
	const centerX = bounds.x + radius;
	const centerY = bounds.y + radius;

	const centerRadius = radius * centerRadiusPercent;
	const tidalAreaHeight = bounds.size * tidalAreaHeightPercent;
	const dialThickness = bounds.size * dialThicknessPercent;
	const dialLength = radius * dialLengthPercent;

	try {

		// Draw the oval
		ctx.beginPath();
		ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
		ctx.closePath();
		ctx.fillStyle = colors.paleBlue;
		ctx.fill();
		ctx.strokeStyle = colors.paleBlue;
		ctx.lineWidth = 2;
		ctx.globalCompositeOperation = "destination-out";
		ctx.stroke();
		ctx.globalCompositeOperation = "source-over";
		ctx.clip();

		// Draw the high / low tide areas as a step "gradient"
		drawTidalAreaGradient(ctx, centerX, bounds.y - radius, radius * 2);
		drawTidalAreaGradient(ctx, centerX, centerY + (radius * 2), radius * 2);

		// Draw the turner
		try {
			ctx.save();
			ctx.translate(centerX, centerY);
			ctx.rotate(drawNums.angle - (Math.PI * .5));
			ctx.translate(-centerX, -centerY);
			ctx.fillStyle = colors.darkBlue;
			ctx.fillRect(centerX, centerY - dialThickness / 2, dialLength, dialThickness);
		}
		finally {
			ctx.restore();
		}

		// Draw the center
		ctx.fillStyle = colors.light;
		ctx.fillRect(centerX - centerRadius, centerY - centerRadius / 2, centerRadius * 2, centerRadius);

		const timeNow = twelveHourDate(drawNums.now);
		setFont(ctx, centerRadius / 2.5);
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillStyle = colors.darkBlue;
		ctx.fillText(timeNow, centerX, centerY);


		// Draw the high
		ctx.fillStyle = colors.light;
		ctx.globalAlpha = .5;
		ctx.fillRect(centerX - centerRadius, bounds.y - centerRadius / 3, centerRadius * 2, centerRadius);
		ctx.globalAlpha = 1;

		const timeHigh = twelveHourDate(drawNums.high);
		setFont(ctx, centerRadius / 2.5);
		ctx.fillStyle = colors.darkBlue;
		ctx.fillText(timeHigh, centerX, bounds.y + centerRadius / 3);

		// Draw the low
		ctx.fillStyle = colors.light;
		ctx.globalAlpha = .5;
		ctx.fillRect(centerX - centerRadius, bounds.y + bounds.size - centerRadius * 2 / 3, centerRadius * 2, centerRadius);
		ctx.globalAlpha = 1;

		const timeLow = twelveHourDate(drawNums.low);
		setFont(ctx, centerRadius / 2.5);
		ctx.fillStyle = colors.darkBlue;
		ctx.fillText(timeLow, centerX, bounds.y + bounds.size - centerRadius / 3);

	}
	finally {
		ctx.restore();
	}
}

function setFont(ctx, size) {
	ctx.font = `${size}px "Gill Sans", "Gill Sans MT", Calibri, sans-serif`;
}

function drawTidalAreaGradient(ctx, centerX, centerY, radius) {
	let zone = 1;
	const stop = .5;
	const step = .1;

	while (zone > stop) {
		ctx.beginPath();
		ctx.arc(centerX, centerY, radius * zone, 0, Math.PI * 2);
		ctx.closePath();
		ctx.globalAlpha = Math.min(((1 - (zone - stop)) / stop) - 1, 1);
		ctx.fillStyle = "black";
		ctx.globalCompositeOperation = "destination-out";
		ctx.fill();

		zone -= step;
	}

	ctx.globalCompositeOperation = "source-over";
	ctx.globalAlpha = 1;
}

function twelveHourDate(date) {
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var ampm = hours >= 12 ? "PM" : "AM";
	hours = hours % 12;
	if (hours === 0)
		hours = 12;
	minutes = minutes < 10 ? "0" + minutes : minutes;
	return `${hours}:${minutes} ${ampm}`
}