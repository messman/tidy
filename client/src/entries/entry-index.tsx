import * as React from "react";
import * as ReactDOM from "react-dom";

import { App } from "../tree/app";
import { ResponsiveLayoutProvider } from "@/unit/hooks/useResponsiveLayout";
import { pickLayout } from "@/tree/responsiveLayout";
import { Wrapper } from "@/tree/wrapper";

ReactDOM.render(
	<Wrapper>
		<ResponsiveLayoutProvider pickLayout={pickLayout}>
			<App />
		</ResponsiveLayoutProvider>
	</Wrapper>,
	document.getElementById("react-root")
);