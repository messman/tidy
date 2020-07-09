import { TestSeed } from '../test/all';

export interface RunFlags {
	logging: {
		/** Whether to log. */
		isActive: boolean;
		/** The prefix to use for log statements. */
		prefix: string | null;
	};
	data: {
		seed: TestSeed;
	};
	keys: {
		weather: string | null;
	};
}

export const defaultRunFlags: RunFlags = {
	logging: {
		isActive: false,
		prefix: null
	},
	data: {
		seed: null
	},
	keys: {
		weather: null
	}
};