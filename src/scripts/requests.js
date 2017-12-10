// API documentation: https://tidesandcurrents.noaa.gov/api/
const api = "https://tidesandcurrents.noaa.gov/api/datagetter"

const fetch_options = {
	station: 8419317, // Default: Wells, ME https://tidesandcurrents.noaa.gov/stationhome.html?id=8419317
	application: "messman/quick-tides",
	format: "json",
	time_zone: "lst", // Local Time
	units: "english", // english | metric
	range: 24 // Last 24 hours
}

function createRequest(opts) {
	opts = Object.assign({}, fetch_options, opts);
	const optsString = Object.keys(opts).map(key => `${key}=${encodeURIComponent(opts[key])}`).join("&");
	return api + "?" + optsString;
}

const products = {
	water_level: { product: "water_level", datum: "mllw" },
	water_level_prediction: { product: "predictions", datum: "mllw" },
	air_temp: { product: "air_temperature" },
	water_temp: { product: "water_temperature" },
	wind: { product: "wind" },
	visibility: { product: "visibility" }
}

let lastRequestTime = -1;
let naturalRefreshTime = 6000 * 60; // 6 minutes, per the API

export function refreshData() {
	const promises = Object.keys(products).map((key) => {
		const url = createRequest(products[key]);
		return fetch(url)
			.then((response) => {
				if (response.ok) {
					return [key, response.json()];
				}
				else {
					[key, Promise.reject(response)];
				}
			})
			.catch(() => {
				alert("Error"); // TODO
			});
	});
	return Promise.all(promises)
}