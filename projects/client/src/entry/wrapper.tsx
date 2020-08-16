import * as React from 'react';
import { InvalidCheck } from '@/areas/alert/invalid';
import { Loading } from '@/areas/alert/loading';
import { Popup, PopupProvider } from '@/areas/alert/popup';
import { ComponentLayoutProvider } from '@/areas/layout/component-layout';
import { LocalStorageThemeProvider } from '@/core/style/theme';
import { AllResponseProvider } from '@/services/data/data';
import { LocalDataPhraseProvider } from '@/services/data/data-local';
import { defaultLowerBreakpoints, DocumentVisibilityProvider, FlexRoot, WindowDimensionsProvider, WindowLayoutProvider } from '@messman/react-common';

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
		<DocumentVisibilityProvider>
			<LocalStorageThemeProvider>
				<WindowDimensionsProvider>
					<WindowLayoutProvider lowerBreakpoints={defaultLowerBreakpoints}>
						<ComponentLayoutProvider>
							<LocalDataPhraseProvider>
								<AllResponseProvider>
									<PopupProvider>
										{props.children}
									</PopupProvider>
								</AllResponseProvider>
							</LocalDataPhraseProvider>
						</ComponentLayoutProvider>
					</WindowLayoutProvider>
				</WindowDimensionsProvider>
			</LocalStorageThemeProvider>
		</DocumentVisibilityProvider>
	);
};

const UI: React.FC = (props) => {
	return (
		<FlexRoot flexDirection='column'>
			<InvalidCheck error={null}>
				<Loading>
					<Popup>
						{props.children}
					</Popup>
				</Loading>
			</InvalidCheck>
		</FlexRoot>
	);
};