import { createWellsConfiguration, getForConfiguration } from '../../dist/index';

export function run(): void {
	const configuration = createWellsConfiguration();
	const response = getForConfiguration(configuration);
	console.dir(response, { depth: null });
}