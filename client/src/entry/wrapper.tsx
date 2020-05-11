import * as React from "react";
import { AppDataProvider } from "@/tree/appData";
import { LocalStorageThemeProvider } from "@/styles/theme";
import { ResponsiveLayoutProvider, defaultLowerBreakpoints } from '@/unit/hooks/layout/responsive-layout';

export const Wrapper: React.FC = (props) => {
	return (
		<AppDataProvider>
			<LocalStorageThemeProvider>
				<ResponsiveLayoutProvider lowerBreakpoints={defaultLowerBreakpoints}>
					{props.children}
				</ResponsiveLayoutProvider>
			</LocalStorageThemeProvider>
		</AppDataProvider>
	);
};