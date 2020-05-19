import { createWellsConfiguration, createContext, createWeatherData } from '../../dist/index';
import { log } from '../test';

export function run(): void {
	const configuration = createWellsConfiguration();
	const context = createContext(configuration);

	const weatherData = createWeatherData(context, 'Caesar');
	log(weatherData.status);
}