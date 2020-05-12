import * as React from 'react';
import { AppDataProvider } from '@/services/data/appData';
import { LocalStorageThemeProvider } from '@/core/style/theme';
import { ResponsiveLayoutProvider, defaultLowerBreakpoints } from '@/services/layout/responsive-layout';
import { InvalidCheck } from '@/areas/alert/invalid';

export const Wrapper: React.FC = (props) => {
	return (
		<LocalStorageThemeProvider>
			<ResponsiveLayoutProvider lowerBreakpoints={defaultLowerBreakpoints}>
				<InvalidCheck>
					<AppDataProvider>
						{props.children}
					</AppDataProvider>
				</InvalidCheck>
			</ResponsiveLayoutProvider>
		</LocalStorageThemeProvider>
	);
};