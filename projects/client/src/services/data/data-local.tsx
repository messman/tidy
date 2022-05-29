import * as React from 'react';
import { useDefine } from '@/services/define';
import { UseLocalStorageReturn } from '@messman/react-common';
import { localStorage } from './local-storage';

const LocalDataPhraseContext = React.createContext<UseLocalStorageReturn<string | null>>(null!);

export const LocalDataPhraseProvider: React.FC = (props) => {
	const { isDevelopment, localTestData } = useDefine();

	// Choose key based on dev/prod environment so we never accidentally mess up a prod user with our testing.
	const devProdString = isDevelopment ? 'dev' : 'prod';
	const key = `data_${devProdString}`;

	const localDataPhraseState = localStorage.useLocalStorage<string | null>(key, (value) => {
		if (isDevelopment && !!localTestData) {
			if (value !== undefined && (value === null || localTestData[value!])) {
				return value;
			}
			return Object.keys(localTestData)[0];
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