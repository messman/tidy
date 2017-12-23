import * as Requests from "./requests.js";
import * as Data from "./sample_data.js";
import * as UI from "./ui.js";
import * as TideWheel from "./tidewheel.js";

const debug = false;

// Entry point to application
document.addEventListener("DOMContentLoaded", function () {
	console.log("Ready!");

	// Check for fetch support
	if (!window.fetch) {
		alert("This browser is not supported. Please use a more modern browser.");
	}

	TideWheel.setup();

	if (!debug) {
		Requests.refreshData()
			.then((values) => {
				let data = {};
				values.forEach(function (datapiece) {
					data[datapiece.key] = datapiece;
				});
				display(Date.now(), data);
			});
	}
	else {

		const data = {};
		Data.data.forEach(function (datapiece) {
			data[datapiece.key] = datapiece;
		});

		display(Data.now, data);
	}
});

function display(now, data) {
	UI.fillNums(data);
	TideWheel.update(now, data);
}