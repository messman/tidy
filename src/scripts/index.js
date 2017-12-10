import * as Requests from "./requests.js";

// Entry point to application
document.addEventListener("DOMContentLoaded", function () {
	console.log("Ready!");

	// Check for fetch support
	if (!window.fetch) {
		alert("This browser is not supported. Please use a more modern browser.");
	}

	Requests.refreshData()
		.then((values) => {
			console.log(values);
		});
});