import * as React from 'react';
import { createContextConsumer } from '@messman/react-common';

/** Value indicates order. */
export enum AppScreen {
	a_home = 100,
	b_beachTime = 101,
	c_tide = 102,
	d_conditions = 103,
	e_education = 104,
	f_about = 105
}

export function canScreenCarouselMoveRight(current: AppScreen): boolean {
	return current !== AppScreen.f_about;
}
export function canScreenCarouselMoveLeft(current: AppScreen): boolean {
	return current !== AppScreen.b_beachTime;
}

export function getScreenCarouselMove(current: AppScreen, isRight: boolean): AppScreen {
	if ((!canScreenCarouselMoveRight(current) && isRight) || (!canScreenCarouselMoveLeft(current) && !isRight)) {
		return current;
	}
	return current + (isRight ? 1 : -1);
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
			screen: AppScreen.a_home
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