import * as React from 'react';
import { useBatchResponse } from '@/index/core/data/data';
import { localStore } from '@/index/core/data/local-storage';
import { WeatherIndicator } from '@wbtdevlocal/iso';
import { BackgroundBubbles } from './background-bubbles';
import { BackgroundLight } from './background-light';

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

	const { success } = useBatchResponse();

	const { hasAnimation } = useBackgroundSetting();

	return (
		<>
			<BackgroundLight isActive={hasAnimation && !!success?.now.weather.current.isDaytime && success?.now.weather.current.indicator === WeatherIndicator.best} />
			<BackgroundBubbles isActive={hasAnimation} />
		</>
	);
};