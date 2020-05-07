import * as React from "react";
import { AppDataProvider } from "@/tree/appData";
import { GlobalAppStyles, ThemeProvider, theme } from "@/styles/theme";

export const Wrapper: React.FC = (props) => {
	return (
		<AppDataProvider>
			<ThemeProvider theme={theme}>
				<>
					<GlobalAppStyles />
					{props.children}
				</>
			</ThemeProvider>
		</AppDataProvider>
	);
};