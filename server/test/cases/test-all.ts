import { createWellsConfiguration, getAllTestForConfiguration, getAllForConfiguration } from '../../dist/index';
import { AllResponse } from 'tidy-shared';

export async function run(): Promise<void> {
	const configuration = createWellsConfiguration();

	const isTest = false;

	let response: AllResponse = null!;
	try {
		if (isTest) {
			response = await getAllTestForConfiguration(configuration, null);
		}
		else {
			response = await getAllForConfiguration(configuration);
		}
	}
	catch (e) {
		console.error(e);
	}
	console.dir(response, { depth: null });
}