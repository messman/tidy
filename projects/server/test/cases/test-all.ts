import { AllResponse } from 'tidy-shared';
import { createWellsConfiguration, getAllForConfiguration, getAllTestForConfiguration, RunFlags } from '../../dist/index';
import { TestEnv } from '../test';

export async function run(env: TestEnv): Promise<void> {
	const configuration = createWellsConfiguration();
	// To work on the end-of-day weather problem
	//configuration.configuration.time.referenceTime = new Date('2020-05-25T23:35:00.000-04:00');

	const isTest = false;

	console.log(env.OpenWeatherDebugAPIKey);
	const runFlags: RunFlags = {
		logging: {
			isActive: true,
			prefix: '>>>'
		},
		data: {
			seed: 'Apple'
		},
		keys: {
			weather: env.OpenWeatherDebugAPIKey
		}
	};

	let response: AllResponse = null!;
	try {
		if (isTest) {
			response = await getAllTestForConfiguration(configuration, runFlags);
		}
		else {
			response = await getAllForConfiguration(configuration, runFlags);
		}
	}
	catch (e) {
		console.error(e);
	}
	console.dir(response, { depth: 3 });
}