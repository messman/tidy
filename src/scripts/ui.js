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
		airTempUI.innerHTML = "?";
		waterTempUI.style.color = "";
	}

	// Wind
	const windData = data["wind"];
	const windUI = document.getElementById(ui.air.wind);
	if (windData.data) {
		const first = windData.data[0];
		const mph = Math.round(first.s * (6076 / 5280) * 10) / 10;
		windUI.innerHTML = `${mph}mph ${first.dr}`;// (${first.d}&deg;)`;
	}
	else {
		windUI.innerHTML = "?"
	}

	// Water Temp
	const waterTempData = data["water_temp"];
	const waterTempUI = document.getElementById(ui.water.temp);
	if (waterTempData.data) {
		const first = waterTempData.data[0];
		waterTempUI.innerHTML = first.v + "&deg;";
	}
	else {
		waterTempUI.innerHTML = "?"
		waterTempUI.style.color = "";
	}

	// Water Level
	const waterLevelData = data["water_level"];
	const waterLevelUI = document.getElementById(ui.water.level);
	if (waterLevelData.data) {
		const first = waterLevelData.data[0];
		waterLevelUI.innerHTML = first.v + "ft";
	}
	else {
		waterLevelUI.innerHTML = "?"
	}
}