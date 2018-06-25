// API documentation: https://tidesandcurrents.noaa.gov/api/
const api = "https://tidesandcurrents.noaa.gov/api/datagetter"

const fetch_options = {
	station: 8419317, // Default: Wells, ME https://tidesandcurrents.noaa.gov/stationhome.html?id=8419317
	application: "messman/quick-tides",
	format: "json",
	time_zone: "lst_ldt", // Local Time with DST offset
	units: "english", // english | metric
}

function createRequest(opts) {
	opts = Object.assign({}, fetch_options, opts);
	const optsString = Object.keys(opts).map(key => `${key}=${encodeURIComponent(opts[key])}`).join("&");
	return api + "?" + optsString;
}

const products = {
	water_level_prediction: { product: "predictions", datum: "mtl" },
	water_level: { product: "water_level", datum: "mtl", date: "latest" },
	air_temp: { product: "air_temperature", date: "latest" },
	water_temp: { product: "water_temperature", date: "latest" },
	wind: { product: "wind", date: "latest" },
}

let lastRequestTime = -1;
let naturalRefreshTime = 6000 * 60; // 6 minutes, per the API

// Return a formatted date minus X hours
function formatDate(minusHours) {
	//yyyyMMdd HH:mm
	const d = new Date();
	d.setHours(d.getHours() - minusHours);
	let twos = [d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes()];
	twos = twos.map(function (num) {
		return num.toString().padStart(2, "0");
	});
	return `${d.getFullYear()}${twos[0]}${twos[1]} ${twos[2]}:${twos[3]}`;
}

const predictionHoursRadius = 20;

export function refreshData() {
	// Update the water_level_prediction to be X hours before and X hours after
	const predictions = products["water_level_prediction"];
	predictions["begin_date"] = formatDate(predictionHoursRadius);
	predictions["range"] = predictionHoursRadius * 2;

	const promises = Object.keys(products).map((key) => {
		const url = createRequest(products[key]);
		return fetch(url)
			.then((response) => {
				if (response.ok) {
					return response.json();
				}
				else {
					return Promise.reject(response);
				}
			})
			.then((data) => {
				data.key = key;
				return data;
			})
			.catch(() => {
				alert("Error"); // TODO
			});
	});
	return Promise.all(promises)
}