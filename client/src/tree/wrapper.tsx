import * as React from "react";
import { AppDataProvider } from "@/tree/appData";
import { LocalStorageThemeProvider } from "@/styles/theme";

export const Wrapper: React.FC = (props) => {
	return (
		<AppDataProvider>
			<LocalStorageThemeProvider>
				{props.children}
			</LocalStorageThemeProvider>
		</AppDataProvider>
	);
};