import * as React from "react";
import * as ReactDOM from "react-dom";

import { DEFINE } from "../services/define";
import { App } from "../tree/app";
import { GlobalAppStyles, ThemeProvider, theme } from "@/styles/theme";
import { ResponsiveLayoutProvider } from "@/unit/hooks/useResponsiveLayout";
import { pickLayout } from "@/tree/responsiveLayout";
import { AppDataProvider } from "@/tree/appData";


const date = new Date(DEFINE.BUILD.TIME);
if (console && console.log)
	console.log(`${DEFINE.BUILD.IS_PRODUCTION ? "Production" : "Debug"} | ${date}`);

ReactDOM.render(
	<ResponsiveLayoutProvider pickLayout={pickLayout}>
		<AppDataProvider>
			<ThemeProvider theme={theme}>
				<>
					<GlobalAppStyles />
					<App />
				</>
			</ThemeProvider>
		</AppDataProvider>
	</ResponsiveLayoutProvider>,
	document.getElementById("react-root")
);