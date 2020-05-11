import * as React from 'react';
import { AppDataProvider } from '@/services/data/appData';
import { LocalStorageThemeProvider } from '@/core/style/theme';
import { ResponsiveLayoutProvider, defaultLowerBreakpoints } from '@/services/layout/responsive-layout';

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