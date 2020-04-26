import { createWellsConfiguration, getAllTestForConfiguration } from '../../dist/index';

export async function run(): Promise<void> {
	const configuration = createWellsConfiguration();

	const response = await getAllTestForConfiguration(configuration);
	console.dir(response, { depth: null });
}