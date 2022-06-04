import * as React from 'react';
import { UseLocalStorageReturn } from '@messman/react-common';
import * as iso from '@wbtdevlocal/iso';
import { DEFINE } from '../define';
import { localStorage } from './local-storage';

const DataSeedContext = React.createContext<UseLocalStorageReturn<iso.Batch.Seed | null>>(null!);

export const DataSeedProvider: React.FC = (props) => {
	const { isDevelopment } = DEFINE;

	// Choose key based on dev/prod environment so we never accidentally mess up a prod user with our testing.
	const key = `data_${isDevelopment ? 'dev' : 'prod'}`;

	const DataSeedState = localStorage.useLocalStorage<iso.Batch.Seed | null>(key, (value) => {
		if (isDevelopment && value && iso.isInEnum(iso.Batch.Seed, value)) {
			return value;
		}
		return null;
	});

	return (
		<DataSeedContext.Provider value={DataSeedState}>
			{props.children}
		</DataSeedContext.Provider>
	);
};

export const useDataSeed = () => React.useContext(DataSeedContext);