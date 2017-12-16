import * as Requests from "./requests.js";
import * as Data from "./sample_data.js";
import * as UI from "./ui.js";

// Entry point to application
document.addEventListener("DOMContentLoaded", function () {
	console.log("Ready!");

	// Check for fetch support
	if (!window.fetch) {
		alert("This browser is not supported. Please use a more modern browser.");
	}

	// Requests.refreshData()
	// 	.then((values) => {
	// 		console.log(values);
	// 	});

	const data = {};
	Data.data.forEach(function (datapiece) {
		data[datapiece.key] = datapiece;
	});
	console.log(data);

	UI.fillNums(data);
});