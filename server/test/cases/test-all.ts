import { createWellsConfiguration, getForConfiguration } from '../../dist/index';

export function run(): void {
	const configuration = createWellsConfiguration();
	//const context = createContext(configuration);

	const response = getForConfiguration(configuration);
	console.dir(response, { depth: null });

	// const tideData = createTideData(context);
	// console.dir(tideData, { depth: null });

	// const astroData = createAstroData(context);
	// console.dir(astroData, { depth: null });
}