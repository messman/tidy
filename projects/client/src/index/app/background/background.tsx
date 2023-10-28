import * as React from 'react';
import { localStore } from '@/index/core/data/local-storage';
import { BackgroundBubbles } from './background-bubbles';

export interface BackgroundContextOutput {
	hasAnimation: boolean;
	setHasAnimation: (value: boolean) => void;
}

const BackgroundContext = React.createContext<BackgroundContextOutput>(null!);

export interface BackgroundProviderProps {
	children?: React.ReactNode;
};

export const BackgroundProvider: React.FC<BackgroundProviderProps> = (props) => {
	const { children } = props;

	const [hasAnimation, setHasAnimation] = localStore.useLocalStorage<boolean>('setting-background-animation', (value) => {
		return value ?? true;
	});

	const value = React.useMemo<BackgroundContextOutput>(() => {
		return {
			hasAnimation,
			setHasAnimation
		};
	}, [hasAnimation, setHasAnimation]);

	return (
		<BackgroundContext.Provider value={value}>
			{children}
		</BackgroundContext.Provider>
	);
};

export function useBackgroundSetting(): BackgroundContextOutput {
	return React.useContext(BackgroundContext);
}

export const Background: React.FC = () => {

	/*
		  #REF_CANVAS_LIGHT_ANIMATION
		We have removed the light animation from the canvas for now.
		It has proven, especially at larger screen sizes, to be a huge render hog.
		This seems to come primarily from the "createLinearGradient" call for the light to make it slowly fade into the water.
		You can see when switching DEBUG mode on and off in that file that rendering works fine with a solid red color.
		I think the best solution for this would be a transparency gradient mask cached to an offscreen canvas and applied on each render,
		as discussed here: https://stackoverflow.com/a/28779849
		We will leave this to the next version to achieve.
	*/
	// const { success } = useBatchResponse();

	const { hasAnimation } = useBackgroundSetting();

	return (
		<>
			{/* <BackgroundLight isActive={hasAnimation && !!success?.now.weather.current.isDaytime && success?.now.weather.current.indicator === WeatherIndicator.best} /> */}
			<BackgroundBubbles isActive={hasAnimation} />
		</>
	);
};