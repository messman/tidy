import * as React from 'react';
import { DEFINE } from '@/index/define';
import { UseLocalStorageReturn } from '@messman/react-common';
import { isInNumberEnum, Seed } from '@wbtdevlocal/iso';
import { localStore } from './local-storage';

const DataSeedContext = React.createContext<UseLocalStorageReturn<Seed | null>>(null!);

export const DataSeedProvider: React.FC<React.PropsWithChildren> = (props) => {
	const { isDevelopment } = DEFINE;

	// Choose key based on dev/prod environment so we never accidentally mess up a prod user with our testing.
	const key = `data_${isDevelopment ? 'dev' : 'prod'}`;

	const DataSeedState = localStore.useLocalStorage<Seed | null>(key, (value) => {
		if (isDevelopment && value && isInNumberEnum(Seed, value)) {
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