import * as React from 'react';
import { AppDataProvider } from '@/services/data/appData';
import { LocalStorageThemeProvider } from '@/core/style/theme';
import { ResponsiveLayoutProvider, defaultLowerBreakpoints } from '@/services/layout/responsive-layout';
import { InvalidCheck } from '@/areas/alert/invalid';
import { PopupProvider, Popup } from '@/areas/alert/popup';

export const Wrapper: React.FC = (props) => {
	return (
		<LocalStorageThemeProvider>
			<ResponsiveLayoutProvider lowerBreakpoints={defaultLowerBreakpoints}>
				<AppDataProvider>
					<PopupProvider>
						<InvalidCheck>
							<Popup>
								{props.children}
							</Popup>
						</InvalidCheck>
					</PopupProvider>
				</AppDataProvider>
			</ResponsiveLayoutProvider>
		</LocalStorageThemeProvider>
	);
};