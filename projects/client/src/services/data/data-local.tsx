import * as React from 'react';
import { DEFINE } from '@/services/define';
import { keyFactory, useLocalStorage, UseLocalStorageReturn } from './local-storage';

const LocalDataPhraseContext = React.createContext<UseLocalStorageReturn<string | null>>(null!);

export const LocalDataPhraseProvider: React.FC = (props) => {

	// Choose key based on dev/prod environment so we never accidentally mess up a prod user with our testing.
	const getKey = keyFactory('tidy');
	const devProdString = DEFINE.isDevelopment ? 'dev' : 'prod';
	const key = getKey(`data_${devProdString}`);

	const localDataPhraseState = useLocalStorage<string | null>(key, () => {
		if (DEFINE.isDevelopment && !!DEFINE.localTestData) {
			return Object.keys(DEFINE.localTestData)[0];
		}
		return null;
	}, (value) => {
		// Validate what we retrieve from localStorage
		if (!value) {
			return true;
		}
		return DEFINE.isDevelopment && !!DEFINE.localTestData && !!DEFINE.localTestData[value!];
	});

	return (
		<LocalDataPhraseContext.Provider value={localDataPhraseState}>
			{props.children}
		</LocalDataPhraseContext.Provider>
	);
};

export const useLocalDataPhrase = () => React.useContext(LocalDataPhraseContext);