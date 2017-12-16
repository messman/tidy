const ui = {
	air: {
		temp: "ui-air-temp",
		wind: "ui-air-wind"
	},
	water: {
		temp: "ui-water-temp",
		level: "ui-water-level"
	}
};

export function fillNums(data) {

	// Air Temp
	const airTempData = data["air_temp"];
	const airTempUI = document.getElementById(ui.air.temp);
	if (airTempData.data) {
		const first = airTempData.data[0];
		airTempUI.innerHTML = first.v + "&deg;";
	}
	else {
		airTempUI.innerHTML = "?"
	}

	// Wind
	const windData = data["wind"];
	const windUI = document.getElementById(ui.air.wind);
	if (windData.data) {
		const first = windData.data[0];
		const mph = Math.round(first.s * (6076 / 5280) * 100) / 100;
		windUI.innerHTML = `${mph} mph ${first.dr} (${first.d}&deg;)`;
	}
	else {
		windUI.innerHTML = "?"
	}
}