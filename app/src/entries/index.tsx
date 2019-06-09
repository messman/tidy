import * as React from "react";
import * as ReactDOM from "react-dom";

import { DEFINE } from "../services/define";
import App from "../views";

const date = new Date(DEFINE.BUILD.TIME);
if (console && console.log)
	console.log(`${DEFINE.BUILD.IS_PRODUCTION ? "Production" : "Debug"} | ${date}`);

ReactDOM.render(
	<App />,
	document.getElementById("react-root")
);