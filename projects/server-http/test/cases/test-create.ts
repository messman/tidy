import { createContext, createWeatherData, createWellsConfiguration, defaultRunFlags } from '../../dist/index';
import { log, TestEnv } from '../test';

export function run(_: TestEnv): void {
	const configuration = createWellsConfiguration();
	const context = createContext(configuration);

	const weatherData = createWeatherData(context, defaultRunFlags);
	log(weatherData);
}