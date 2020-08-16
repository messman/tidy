import * as React from 'react';
import { DEFINE } from '@/services/define';
import { UseLocalStorageReturn } from '@messman/react-common';
import { localStorage } from './local-storage';

const LocalDataPhraseContext = React.createContext<UseLocalStorageReturn<string | null>>(null!);

export const LocalDataPhraseProvider: React.FC = (props) => {

	// Choose key based on dev/prod environment so we never accidentally mess up a prod user with our testing.
	const devProdString = DEFINE.isDevelopment ? 'dev' : 'prod';
	const key = `data_${devProdString}`;

	const localDataPhraseState = localStorage.useLocalStorage<string | null>(key, (value) => {
		if (DEFINE.isDevelopment && !!DEFINE.localTestData) {
			if (value !== undefined && (value === null || DEFINE.localTestData[value!])) {
				return value;
			}
			return Object.keys(DEFINE.localTestData)[0];
		}
		return null;
	});

	return (
		<LocalDataPhraseContext.Provider value={localDataPhraseState}>
			{props.children}
		</LocalDataPhraseContext.Provider>
	);
};

export const useLocalDataPhrase = () => React.useContext(LocalDataPhraseContext);