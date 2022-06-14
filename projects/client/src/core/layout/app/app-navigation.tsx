import * as React from 'react';
import { createContextConsumer } from '@messman/react-common';

export enum AppScreen {
	home,
	beachTime,
	tide,
	conditions,
	education,
	about
}

export interface AppNavigationState {
	screen: AppScreen;
}

export interface AppNavigationOutput extends AppNavigationState {
	setScreen: (screen: AppScreen) => void;
}

const [AppNavigationContextProvider, useAppNavigationContext] = createContextConsumer<AppNavigationOutput>(null!);

export const useAppNavigation = useAppNavigationContext;

export const AppNavigationProvider: React.FC = (props) => {

	const [state, setState] = React.useState<AppNavigationState>(() => {
		return {
			screen: AppScreen.home
		};
	});

	const output = React.useMemo<AppNavigationOutput>(() => {
		return {
			...state,
			setScreen: (screen) => {
				setState({
					screen
				});
			}
		};
	}, [state]);

	return (
		<AppNavigationContextProvider value={output}>
			{props.children}
		</AppNavigationContextProvider>
	);
};