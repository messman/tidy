import * as React from "react";
import * as ReactDOM from "react-dom";

import { App } from "../tree/app";
import { Wrapper } from "@/tree/wrapper";

ReactDOM.render(
	<Wrapper>
		<App />
	</Wrapper>,
	document.getElementById("react-root")
);