import { AllResponse } from 'tidy-shared';
import { createWellsConfiguration, getAllForConfiguration, getAllTestForConfiguration } from '../../dist/index';

export async function run(): Promise<void> {
	const configuration = createWellsConfiguration();
	// To work on the end-of-day weather problem
	//configuration.configuration.time.referenceTime = new Date('2020-05-25T23:35:00.000-04:00');

	const isTest = true;

	let response: AllResponse = null!;
	try {
		if (isTest) {
			response = await getAllTestForConfiguration(configuration, 'Apple');
		}
		else {
			response = await getAllForConfiguration(configuration);
		}
	}
	catch (e) {
		console.error(e);
	}
	console.dir(response, { depth: 3 });
}