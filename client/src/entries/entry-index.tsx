import * as React from "react";
import * as ReactDOM from "react-dom";

import { App } from "../tree/app";
import { GlobalAppStyles, ThemeProvider, theme } from "@/styles/theme";
import { ResponsiveLayoutProvider } from "@/unit/hooks/useResponsiveLayout";
import { pickLayout } from "@/tree/responsiveLayout";
import { AppDataProvider } from "@/tree/appData";

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