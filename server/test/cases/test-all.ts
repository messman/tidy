import { createWellsConfiguration, getAllTestForConfiguration, getAllForConfiguration } from '../../dist/index';
import { AllResponse } from 'tidy-shared';

export async function run(): Promise<void> {
	const configuration = createWellsConfiguration();

	const isTest = false;

	let response: AllResponse = null!;
	if (isTest) {
		response = await getAllTestForConfiguration(configuration);
	}
	else {
		response = await getAllForConfiguration(configuration);
	}
	console.dir(response, { depth: null });
}