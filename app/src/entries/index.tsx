import * as React from "react";
import * as ReactDOM from "react-dom";

import { DEFINE } from "../services/define";
import { App } from "../tree";
import { GlobalAppStyles } from "@/styles/theme";

const date = new Date(DEFINE.BUILD.TIME);
if (console && console.log)
	console.log(`${DEFINE.BUILD.IS_PRODUCTION ? "Production" : "Debug"} | ${date}`);

ReactDOM.render(
	<>
		<GlobalAppStyles />
		<App />
	</>,
	document.getElementById("react-root")
);