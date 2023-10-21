import { WeatherStatusType } from '@wbtdevlocal/iso';

/** Capitalizes the first letter. */
export function capitalizeFirst<T extends string>(phrase: T) {
	return (phrase[0].toUpperCase() + phrase.slice(1)) as Capitalize<typeof phrase>;
}

export interface WeatherStatusDescription {
	/** "It's _____ and 70 degrees." No capitalization. */
	nowItIs: string;
	/** "_____ conditions expected" */
	futureConditions: string;
	shouldUseCaution: boolean;
	isRainImplied: boolean;
}

export const weatherStatusDescription: Record<keyof typeof WeatherStatusType, WeatherStatusDescription> = {
	unknown: {
		nowItIs: 'unknown weather',
		futureConditions: 'unknown weather',
		shouldUseCaution: false,
		isRainImplied: false
	},
	clear: {
		nowItIs: 'clear',
		futureConditions: 'fair and clear',
		shouldUseCaution: false,
		isRainImplied: false
	},
	clear_hot: {
		nowItIs: 'clear',
		futureConditions: 'high-heat',
		shouldUseCaution: true,
		isRainImplied: false
	},
	clear_cold: {
		nowItIs: 'clear',
		futureConditions: 'chilly',
		shouldUseCaution: false,
		isRainImplied: false
	},
	clouds_few: {
		nowItIs: 'lightly cloudy',
		futureConditions: 'lightly cloudy',
		shouldUseCaution: false,
		isRainImplied: false
	},
	clouds_some: {
		nowItIs: 'partly cloudy',
		futureConditions: 'partly cloudy',
		shouldUseCaution: false,
		isRainImplied: false
	},
	clouds_most: {
		nowItIs: 'mostly cloudy',
		futureConditions: 'cloudy',
		shouldUseCaution: false,
		isRainImplied: false
	},
	clouds_over: {
		nowItIs: 'overcast',
		futureConditions: 'overcast',
		shouldUseCaution: false,
		isRainImplied: false
	},
	rain_drizzle: {
		nowItIs: 'drizzling',
		futureConditions: 'drizzle / light rain',
		shouldUseCaution: false,
		isRainImplied: true
	},
	rain_light: {
		nowItIs: 'lightly rainy',
		futureConditions: 'light rain',
		shouldUseCaution: false,
		isRainImplied: true
	},
	rain_medium: {
		nowItIs: 'rainy',
		futureConditions: 'rainy',
		shouldUseCaution: false,
		isRainImplied: true
	},
	rain_heavy: {
		nowItIs: 'very rainy',
		futureConditions: 'heavy rain',
		shouldUseCaution: true,
		isRainImplied: true
	},
	rain_freeze: {
		nowItIs: 'rainy',
		futureConditions: 'freezing rain',
		shouldUseCaution: false,
		isRainImplied: true
	},
	snow_light: {
		nowItIs: 'snowy',
		futureConditions: 'light snow',
		shouldUseCaution: false,
		isRainImplied: true
	},
	snow_medium: {
		nowItIs: 'snowing',
		futureConditions: 'snowy',
		shouldUseCaution: false,
		isRainImplied: true
	},
	snow_heavy: {
		nowItIs: 'very snowy',
		futureConditions: 'heavy snow',
		shouldUseCaution: false,
		isRainImplied: true
	},
	snow_sleet: {
		nowItIs: 'sleeting',
		futureConditions: 'sleet',
		shouldUseCaution: false,
		isRainImplied: true
	},
	snow_rain: {
		nowItIs: 'rainy / snowy',
		futureConditions: 'snow and rain',
		shouldUseCaution: false,
		isRainImplied: true
	},
	thun_light: {
		nowItIs: 'potentially stormy',
		futureConditions: 'light / scattered thunderstorm',
		shouldUseCaution: true,
		isRainImplied: true
	},
	thun_medium: {
		nowItIs: 'stormy',
		futureConditions: 'thunderstorm',
		shouldUseCaution: true,
		isRainImplied: true
	},
	thun_heavy: {
		nowItIs: 'stormy',
		futureConditions: 'heavy thunderstorm',
		shouldUseCaution: true,
		isRainImplied: true
	},
	intense_storm: {
		nowItIs: 'stormy',
		futureConditions: 'intense / dangerous storm',
		shouldUseCaution: true,
		isRainImplied: true
	},
	intense_other: {
		nowItIs: 'intense weather',
		futureConditions: 'intense / dangerous weather',
		shouldUseCaution: true,
		isRainImplied: false
	},
	dust: {
		nowItIs: 'dusty',
		futureConditions: 'dusty',
		shouldUseCaution: false,
		isRainImplied: false
	},
	smoke: {
		nowItIs: 'smoky',
		futureConditions: 'smoky',
		shouldUseCaution: true,
		isRainImplied: false
	},
	haze: {
		nowItIs: 'hazy',
		futureConditions: 'hazy',
		shouldUseCaution: false,
		isRainImplied: false
	},
	fog: {
		nowItIs: 'foggy / misty',
		futureConditions: 'foggy / misty',
		shouldUseCaution: false,
		isRainImplied: false
	}
};