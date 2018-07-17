import * as Requests from "./requests";
import * as Data from "./sample_data";
import * as UI from "./ui";
import * as TideWheel from "./tidewheel";

const DEBUG = false;
const DEBUG_DATA = false;

// Entry point to application
document.addEventListener("DOMContentLoaded", function () {
	if (DEBUG)
		console.log("Ready!");

	// Check for fetch support
	if (!window.fetch) {
		alert("This browser is not supported. Please use a more modern browser.");
		return;
	}

	// Set up the canvas for the tide wheel.
	TideWheel.setup();

	if (!DEBUG_DATA) {
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
	TideWheel.update(now, data, DEBUG);
}