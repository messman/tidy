import { createContext, createWeatherData, createWellsConfiguration } from '../../dist/index';
import { defaultRunFlags } from '../../dist/util/run-flags';
import { log, TestEnv } from '../test';

export function run(_: TestEnv): void {
	const configuration = createWellsConfiguration();
	const context = createContext(configuration);

	const weatherData = createWeatherData(context, defaultRunFlags);
	log(weatherData);
}