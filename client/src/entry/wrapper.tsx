import * as React from 'react';
import { AllResponseProvider } from '@/services/data/data';
import { LocalStorageThemeProvider } from '@/core/style/theme';
import { ResponsiveLayoutProvider, defaultLowerBreakpoints } from '@/services/layout/responsive-layout';
import { InvalidCheck } from '@/areas/alert/invalid';
import { PopupProvider, Popup } from '@/areas/alert/popup';
import { ComponentLayoutProvider } from '@/areas/layout/component-layout';
import { FlexRoot } from '@/core/layout/flex';

export const Wrapper: React.FC = (props) => {
	return (
		<Providers>
			<UI>
				{props.children}
			</UI>
		</Providers>
	);
};

const Providers: React.FC = (props) => {
	return (
		<LocalStorageThemeProvider>
			<ResponsiveLayoutProvider lowerBreakpoints={defaultLowerBreakpoints}>
				<ComponentLayoutProvider>
					<AllResponseProvider>
						<PopupProvider>
							{props.children}
						</PopupProvider>
					</AllResponseProvider>
				</ComponentLayoutProvider>
			</ResponsiveLayoutProvider>
		</LocalStorageThemeProvider>
	);
}

const UI: React.FC = (props) => {
	return (
		<FlexRoot>
			<InvalidCheck>
				<Popup>
					{props.children}
				</Popup>
			</InvalidCheck>
		</FlexRoot>
	);
}